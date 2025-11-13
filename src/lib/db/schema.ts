import { z } from 'zod';

// User role enum
export enum UserRole {
  ADMIN = 'admin',
  COACH = 'coach',
  PARENTS = 'parents',
  STUDENTS = 'students',
}

// User schema validation
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  mobile: z.string().min(10).max(15).regex(/^[0-9+\-\s()]+$/, 'Invalid mobile number format'),
  role: z.nativeEnum(UserRole),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UserCreateSchema = UserSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;

// User without password for API responses
export type SafeUser = Omit<User, 'password'>;
