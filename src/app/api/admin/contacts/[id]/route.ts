import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${BACKEND_URL}/api/admin/contacts/${id}`, {
      headers: {
        'Authorization': authHeader || '',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Contact proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve contact' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/admin/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Update contact proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${BACKEND_URL}/api/admin/contacts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader || '',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Delete contact proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
