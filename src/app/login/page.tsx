import { AuthCard } from '@/components/auth/auth-card'
import { AuthHeader } from '@/components/auth/auth-header'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { Separator } from '@/components/ui/separator'
import LoginForm from './signin-form'
import { FlameAmbient } from '@/components/visuals/FlameAmbient'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
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
          <AuthHeader title="Welcome back" subtitle="Sign in to your account" />

          <div className="px-6 pt-4">
            <OAuthButtons />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wide">
                <span className="bg-card px-2 text-fg-muted">or</span>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <LoginForm />
            <p className="mt-6 text-center text-xs text-fg-muted">
              By continuing, you agree to our{' '}
              <a className="underline" href="/terms">Terms</a> and <a className="underline" href="/privacy">Privacy Policy</a>.
            </p>
          </div>
        </AuthCard>

        <p className="mt-6 text-center text-sm text-fg-muted">
          New here? <a className="text-accent underline" href="/register">Create an account</a>
        </p>
      </div>
    </div>
  )
}
