import { getDatabase } from './lmdb';
import { User, UserCreate, SafeUser } from './schema';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const USERS_PREFIX = 'users:';
const EMAIL_INDEX_PREFIX = 'email_index:';

export class UserModel {
  private static generateId(): string {
    return randomBytes(16).toString('hex');
  }

  private static getSafeUser(user: User): SafeUser {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  static async create(userData: UserCreate): Promise<SafeUser> {
    const db = getDatabase();
    
    // Check if email already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user: User = {
      id: this.generateId(),
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      name: userData.name,
      mobile: userData.mobile,
      role: userData.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store user
    await db.put(`${USERS_PREFIX}${user.id}`, user);
    
    // Create email index
    await db.put(`${EMAIL_INDEX_PREFIX}${user.email}`, user.id);

    return this.getSafeUser(user);
  }

  static async findById(id: string): Promise<SafeUser | null> {
    const db = getDatabase();
    const user = await db.get(`${USERS_PREFIX}${id}`);
    
    if (!user) return null;
    return this.getSafeUser(user as User);
  }

  static async findByEmail(email: string): Promise<User | null> {
    const db = getDatabase();
    const userId = await db.get(`${EMAIL_INDEX_PREFIX}${email.toLowerCase()}`);
    
    if (!userId) return null;
    
    const user = await db.get(`${USERS_PREFIX}${userId}`);
    return user as User | null;
  }

  static async verifyPassword(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.findByEmail(email);
    
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) return null;

    return this.getSafeUser(user);
  }

  static async update(id: string, updates: Partial<UserCreate>): Promise<SafeUser | null> {
    const db = getDatabase();
    const existingUser = await db.get(`${USERS_PREFIX}${id}`) as User | null;
    
    if (!existingUser) return null;

    // If password is being updated, hash it
    let hashedPassword = existingUser.password;
    if (updates.password) {
      hashedPassword = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser: User = {
      ...existingUser,
      ...updates,
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    };

    // If email changed, update email index
    if (updates.email && updates.email !== existingUser.email) {
      await db.remove(`${EMAIL_INDEX_PREFIX}${existingUser.email}`);
      await db.put(`${EMAIL_INDEX_PREFIX}${updatedUser.email}`, updatedUser.id);
    }

    await db.put(`${USERS_PREFIX}${id}`, updatedUser);

    return this.getSafeUser(updatedUser);
  }

  static async delete(id: string): Promise<boolean> {
    const db = getDatabase();
    const user = await db.get(`${USERS_PREFIX}${id}`) as User | null;
    
    if (!user) return false;

    await db.remove(`${USERS_PREFIX}${id}`);
    await db.remove(`${EMAIL_INDEX_PREFIX}${user.email}`);

    return true;
  }

  static async listAll(): Promise<SafeUser[]> {
    const db = getDatabase();
    const users: SafeUser[] = [];

    for await (const { key, value } of db.getRange({ 
      start: USERS_PREFIX, 
      end: USERS_PREFIX + '\xFF' 
    })) {
      users.push(this.getSafeUser(value as User));
    }

    return users;
  }

  static async listByRole(role: string): Promise<SafeUser[]> {
    const allUsers = await this.listAll();
    return allUsers.filter(user => user.role === role);
  }
}
