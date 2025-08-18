import db from './db';

interface ContentItem {
  id?: string;
  [key: string]: any;
}

export async function createItem<T extends ContentItem>(type: string, data: T): Promise<T> {
  const id = data.id || Date.now().toString(); // Use existing ID or generate a new one
  const key = `${type}:${id}`;
  await db.put(key, { id, ...data });
  return { id, ...data };
}

export async function getItem<T extends ContentItem>(type: string, id: string): Promise<T | null> {
  try {
    const key = `${type}:${id}`;
    return await db.get(key) as T;
  } catch (error: any) {
    if (error.notFound) {
      return null;
    }
    throw error;
  }
}

export async function updateItem<T extends ContentItem>(type: string, id: string, data: Partial<T>): Promise<T | null> {
  const existingItem = await getItem<T>(type, id);
  if (!existingItem) {
    return null;
  }
  const updatedData = { ...existingItem, ...data };
  const key = `${type}:${id}`;
  await db.put(key, updatedData);
  return updatedData;
}

export async function deleteItem(type: string, id: string): Promise<boolean> {
  try {
    const key = `${type}:${id}`;
    await db.del(key);
    return true;
  } catch (error: any) {
    if (error.notFound) {
      return false; // Item not found, so nothing to delete
    }
    throw error;
  }
}

export async function getAllItems<T extends ContentItem>(type: string): Promise<T[]> {
  const items: T[] = [];
  for await (const [key, value] of db.iterator({ gte: `${type}:`, lt: `${type};` })) {
    items.push(value as T);
  }
  return items;
}