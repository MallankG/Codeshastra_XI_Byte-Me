// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Enable WebSocket connections for Socket.IO
  if (request.nextUrl.pathname.startsWith('/api/socket')) {
    return NextResponse.next({
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/socket/:path*'],
}