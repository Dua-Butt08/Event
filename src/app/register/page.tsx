import { AuthCard } from '@/components/auth/auth-card'
import { AuthHeader } from '@/components/auth/auth-header'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import RegisterForm from './signup-form'
import { FlameAmbient } from '@/components/visuals/FlameAmbient'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'

export default async function RegisterPage() {
  // Redirect authenticated users to dashboard
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/dashboard');
  }
  return (
    <div className="relative min-h-[100dvh] grid place-items-center px-4 py-10 overflow-hidden">
      <FlameAmbient />
      <div className="w-full max-w-[440px]">
        <AuthCard>
          <AuthHeader title="Create your account" subtitle="Get instant access" />
          <div className="px-6 pt-4">
            <OAuthButtons />
          </div>
          <div className="px-6 pb-6">
            <RegisterForm />
          </div>
        </AuthCard>
        <p className="mt-6 text-center text-sm text-fg-muted">
          Already have an account? <a className="text-accent underline" href="/login">Sign in</a>
        </p>
      </div>
    </div>
  )
}
