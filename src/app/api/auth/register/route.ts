import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/lib/db/user.model';
import { UserCreateSchema } from '@/lib/db/schema';
import { createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = UserCreateSchema.parse(body);

    // Create user
    const user = await UserModel.create(validatedData);

    // Create session
    await createSession(user);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    if (error.message === 'Email already exists') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
