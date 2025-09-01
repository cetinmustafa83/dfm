import bcrypt from 'bcryptjs'
import { db, DB_COLLECTIONS } from './db'
import { User } from '@/types'

// Authentication service
export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  }

  // Verify password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  // Create user with password
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'> & { password: string }): Promise<User> {
    const passwordHash = await this.hashPassword(userData.password)
    
    const id = `${DB_COLLECTIONS.USERS}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Remove plain password from user data
    const { password, ...userDataWithoutPassword } = userData
    
    const user: User = {
      ...userDataWithoutPassword,
      passwordHash,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await db.put(id, user)
    return user
  }

  // Authenticate user
  static async authenticate(email: string, password: string): Promise<User | null> {
    const users = await db.getAll<User>(DB_COLLECTIONS.USERS)
    const user = users.find(u => u.email === email && u.isActive)
    
    if (!user) {
      return null
    }

    const isValid = await this.verifyPassword(password, user.passwordHash)
    
    if (!isValid) {
      return null
    }

    // Update last login
    user.lastLogin = new Date()
    await db.put(user.id, user)

    return user
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    return db.get<User>(id)
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    const users = await db.getAll<User>(DB_COLLECTIONS.USERS)
    return users.find(u => u.email === email) || null
  }

  // Update user password
  static async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const passwordHash = await this.hashPassword(newPassword)
    user.passwordHash = passwordHash
    user.updatedAt = new Date()

    await db.put(userId, user)
  }
}