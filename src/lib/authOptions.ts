import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * NextAuth configuration with optimized session management
 * - 2-hour JWT session with sliding expiration
 * - 5-minute update interval for active sessions
 * - Supports Google OAuth and email/password authentication
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          const user = await prisma.user.findUnique({ 
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              passwordHash: true
            }
          });
          
          if (!user?.passwordHash) {
            return null;
          }
          
          const ok = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!ok) {
            return null;
          }
          
          return { 
            id: user.id, 
            name: user.name ?? null, 
            email: user.email, 
            image: user.image ?? null 
          } as {
            id: string;
            name: string | null;
            email: string;
            image: string | null;
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { 
    strategy: 'jwt',
    maxAge: 7200, // 2 hours in seconds
    updateAge: 300, // Update session every 5 minutes
  },
  pages: { 
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
      }
      
      // Update token timestamp on session updates
      if (trigger === 'update') {
        token.iat = Math.floor(Date.now() / 1000);
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative callback URLs
      if (url.startsWith('/')) {
        return url;
      } 
      // Allow absolute URLs within our domain
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // For any other URLs, redirect to dashboard
      return `${baseUrl}/dashboard`;
    },
    async signIn({ user }) {
      // Allow sign in if user exists
      if (user?.email) {
        return true;
      }
      // Deny sign in otherwise
      return false;
    },
  },
  // Enhanced security settings
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
};
