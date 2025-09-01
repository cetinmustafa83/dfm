import fs from 'fs/promises'
import path from 'path'

// Database interface
export interface DatabaseEntry {
  id: string
  createdAt: Date
  updatedAt: Date
  [key: string]: any
}

// Simple file-based database service
export class DatabaseService {
  private dataDir: string
  private data: Map<string, any>

  constructor(dbName: string = 'dfm-db') {
    this.dataDir = path.join(process.cwd(), 'data', dbName)
    this.data = new Map()
  }

  // Initialize database
  async init(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true })
      await this.loadData()
    } catch (error) {
      console.warn('Could not load existing data, starting fresh:', error)
    }
  }

  // Load data from files
  private async loadData(): Promise<void> {
    try {
      const files = await fs.readdir(this.dataDir)
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.dataDir, file)
          const content = await fs.readFile(filePath, 'utf-8')
          const data = JSON.parse(content)
          this.data.set(file.replace('.json', ''), data)
        }
      }
    } catch (error) {
      console.warn('Error loading data:', error)
    }
  }

  // Save data to file
  private async saveToFile(key: string, data: any): Promise<void> {
    const filePath = path.join(this.dataDir, `${key}.json`)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
  }

  // Create or update an entry
  async put(key: string, value: any): Promise<void> {
    const entry: DatabaseEntry = {
      ...value,
      id: key,
      updatedAt: new Date(),
      createdAt: value.createdAt || new Date()
    }
    
    this.data.set(key, entry)
    await this.saveToFile(key, entry)
  }

  // Get an entry by key
  async get<T = any>(key: string): Promise<T | null> {
    return this.data.get(key) || null
  }

  // Delete an entry
  async del(key: string): Promise<void> {
    this.data.delete(key)
    const filePath = path.join(this.dataDir, `${key}.json`)
    try {
      await fs.unlink(filePath)
    } catch (error) {
      // File might not exist, which is fine
    }
  }

  // Get all entries with a prefix
  async getAll<T = any>(prefix: string = ''): Promise<T[]> {
    const entries: T[] = []
    
    for (const [key, value] of this.data.entries()) {
      if (key.startsWith(prefix)) {
        entries.push(value)
      }
    }

    return entries
  }

  // Close the database connection
  async close(): Promise<void> {
    // Nothing to close for file-based DB
  }
}

// Database collections
export const DB_COLLECTIONS = {
  USERS: 'users:',
  PROJECTS: 'projects:',
  LICENSES: 'licenses:',
  CONTENT: 'content:',
  REQUESTS: 'requests:',
  SETTINGS: 'settings:'
} as const

// Singleton database instance
const db = new DatabaseService()

// Initialize database when imported
db.init().catch(console.error)

export { db }