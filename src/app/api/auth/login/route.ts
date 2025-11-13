import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/lib/db/user.model';
import { UserLoginSchema } from '@/lib/db/schema';
import { createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = UserLoginSchema.parse(body);

    // Verify credentials
    const user = await UserModel.verifyPassword(
      validatedData.email,
      validatedData.password
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

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

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
