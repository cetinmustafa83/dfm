import { db, DB_COLLECTIONS } from '@/lib/db'

async function testDatabase() {
  console.log('Testing LevelDB integration...')
  
  try {
    // Test creating a user
    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
      role: 'customer' as const,
      isActive: true
    }
    
    const userId = `${DB_COLLECTIONS.USERS}test-user-1`
    await db.put(userId, testUser)
    console.log('✓ User created successfully')
    
    // Test retrieving the user
    const retrievedUser = await db.get(userId)
    console.log('✓ User retrieved successfully:', retrievedUser)
    
    // Test getting all users
    const allUsers = await db.getAll(DB_COLLECTIONS.USERS)
    console.log('✓ All users retrieved:', allUsers.length)
    
    // Test deleting the user
    await db.del(userId)
    console.log('✓ User deleted successfully')
    
    console.log('All database tests passed! 🎉')
    
  } catch (error) {
    console.error('Database test failed:', error)
  } finally {
    await db.close()
  }
}

testDatabase()