import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, "scryfall_cards.json");

async function fetchBulkData() {
  try {
    console.log("Fetching Scryfall bulk data metadata...");
    const res = await fetch("https://api.scryfall.com/bulk-data/default_cards");
    const defaultCards = await res.json();

    if (!defaultCards) {
      throw new Error("Default cards bulk data not found!");
    }

    console.log("Downloading default cards JSON...");
    const cardsRes = await fetch(defaultCards.download_uri);

    if (!cardsRes.body) {
      throw new Error("No response body");
    }

    const fileStream = fs.createWriteStream(outputPath);

    await pipeline(Readable.from(cardsRes.body), fileStream);

    console.log(`Saved cards to ${outputPath}`);
  } catch (err) {
    console.log("Failed to fetch Scryfall data:", err);
  }
}

fetchBulkData();
