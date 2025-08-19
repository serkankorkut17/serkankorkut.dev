import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const cookieName = process.env.PASSWORD_COOKIE_NAME || "admin-auth";
    const token = request.cookies.get(cookieName);
    
    console.log('Verify endpoint - Cookie name:', cookieName);
    console.log('Verify endpoint - Token found:', !!token);
    console.log('Verify endpoint - Token value:', token?.value);
    
    if (!token || token.value !== "true") {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
