import fs from 'fs/promises';
import path from 'path';

export type JsonData<T> = {
  [key: string]: T[];
};

export class JsonDb<T> {
  private filePath: string;
  private dataKey: string;

  constructor(filePath: string, dataKey: string) {
    this.filePath = path.join(process.cwd(), filePath);
    this.dataKey = dataKey;
  }

  private async readData(): Promise<JsonData<T>> {
    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      return { [this.dataKey]: [] };
    }
  }

  private async writeData(data: JsonData<T>): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async getAll(): Promise<T[]> {
    const data = await this.readData();
    return data[this.dataKey] || [];
  }

  async getById(id: string): Promise<T | null> {
    const items = await this.getAll();
    return items.find((item: any) => item.id === id) || null;
  }

  async create(item: T): Promise<T> {
    const data = await this.readData();
    const items = data[this.dataKey] || [];
    items.push(item);
    data[this.dataKey] = items;
    await this.writeData(data);
    return item;
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const data = await this.readData();
    const items = data[this.dataKey] || [];
    const index = items.findIndex((item: any) => item.id === id);

    if (index === -1) {
      return null;
    }

    items[index] = { ...items[index], ...updates };
    data[this.dataKey] = items;
    await this.writeData(data);
    return items[index];
  }

  async delete(id: string): Promise<boolean> {
    const data = await this.readData();
    const items = data[this.dataKey] || [];
    const filteredItems = items.filter((item: any) => item.id !== id);

    if (filteredItems.length === items.length) {
      return false;
    }

    data[this.dataKey] = filteredItems;
    await this.writeData(data);
    return true;
  }
}

export const servicesDb = new JsonDb<any>('db/json-data/services.json', 'services');
export const projectsDb = new JsonDb<any>('db/json-data/projects.json', 'projects');
export const teamDb = new JsonDb<any>('db/json-data/team.json', 'team');
export const blogDb = new JsonDb<any>('db/json-data/blog.json', 'posts');
export const messagesDb = new JsonDb<any>('db/json-data/messages.json', 'messages');
export const seoDb = new JsonDb<any>('db/json-data/seo.json', 'seo');
