import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    const response = await fetch(`${BACKEND_URL}/api/admin/contacts?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': authHeader || '',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Contacts proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve contacts' },
      { status: 500 }
    );
  }
}
