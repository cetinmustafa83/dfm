import level from "level";
import path from "path";

// Create or connect to the database
const dbPath = path.join(process.cwd(), "data", "dfm.db");
export const db = level(dbPath, { valueEncoding: "json" });

// Ensure the database is closed properly
process.on("beforeExit", async () => {
  await db.close();
});