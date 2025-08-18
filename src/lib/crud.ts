import { db } from "./db";
import { v4 as uuidv4 } from "uuid";

// Get all items of a type
export async function getAll(type: string) {
  const items: any[] = [];
  const prefix = `${type}:`;
  
  for await (const [key, value] of db.iterator({ gte: prefix, lt: `${type}:\xff` })) {
    items.push({ id: key.split(":")[1], ...value });
  }
  
  return items;
}

// Get a single item by type and id
export async function getById(type: string, id: string) {
  try {
    const key = `${type}:${id}`;
    const value = await db.get(key);
    return { id, ...value };
  } catch (error) {
    return null;
  }
}

// Create a new item
export async function create(type: string, data: any) {
  const id = uuidv4();
  const key = `${type}:${id}`;
  await db.put(key, data);
  return { id, ...data };
}

// Update an existing item
export async function update(type: string, id: string, data: any) {
  const key = `${type}:${id}`;
  await db.put(key, data);
  return { id, ...data };
}

// Delete an item
export async function remove(type: string, id: string) {
  const key = `${type}:${id}`;
  await db.del(key);
}

// Get site settings
export async function getSettings() {
  try {
    const settings = await db.get("site:settings");
    return settings;
  } catch (error) {
    return {};
  }
}

// Update site settings
export async function updateSettings(settings: any) {
  await db.put("site:settings", settings);
  return settings;
}