import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting (for development/small deployments)
// For production with multiple servers, use Redis-based solution like @upstash/ratelimit
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 100; // requests per window (increased for polling)
const WINDOW = 60 * 1000; // 1 minute in milliseconds

// Cleanup old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetTime) {
      rateLimit.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function middleware(request: NextRequest) {
  // Only rate limit API routes (except auth callback)
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip rate limiting for auth callbacks
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Skip rate limiting for read-only results endpoint (used for polling)
  if (request.nextUrl.pathname.startsWith('/api/results/')) {
    return NextResponse.next();
  }

  // Get client IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
             request.headers.get('x-real-ip') || 
             'anonymous';
  
  const now = Date.now();
  const userLimit = rateLimit.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimit.set(ip, { count: 1, resetTime: now + WINDOW });
    return NextResponse.next();
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return NextResponse.json(
      { 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((userLimit.resetTime - now) / 1000).toString(),
          'X-RateLimit-Limit': RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(userLimit.resetTime).toISOString(),
        }
      }
    );
  }
  
  // Increment count
  userLimit.count++;
  
  const response = NextResponse.next();
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT.toString());
  response.headers.set('X-RateLimit-Remaining', (RATE_LIMIT - userLimit.count).toString());
  response.headers.set('X-RateLimit-Reset', new Date(userLimit.resetTime).toISOString());
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
