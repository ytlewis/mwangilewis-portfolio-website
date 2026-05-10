import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'gathaiyalewis1122@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@Lewis2025';
const JWT_SECRET = process.env.JWT_SECRET || 'lewis-portfolio-secret-key-2025';

function base64url(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function createToken(payload: object): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24h
  }));
  const sig = createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return `${header}.${body}.${sig}`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (
      email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase() ||
      password !== ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = createToken({ email: ADMIN_EMAIL, role: 'admin' });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: { email: ADMIN_EMAIL, role: 'admin' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed due to server error' },
      { status: 500 }
    );
  }
}
