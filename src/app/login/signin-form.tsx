"use client";
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui-kit/Input';
import { Button } from '@/components/ui-kit/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState('/dashboard');

  useEffect(() => {
    // Get callback URL from query parameters after component mounts
    const urlParams = new URLSearchParams(window.location.search);
    const urlCallback = urlParams.get('callbackUrl') || '/dashboard';
    setCallbackUrl(urlCallback);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    // Validate fields
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    setLoading(true);
    try {
      const res = await signIn('credentials', { redirect: false, email, password });
      
      if (!res?.ok) {
        if (res?.error) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        // Redirect to the callback URL after successful login
        window.location.href = callbackUrl;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400 font-medium" role="alert">
            ⚠️ {error}
          </p>
        </div>
      )}
      <Input 
        id="email" 
        label="Email"
        type="email" 
        autoComplete="email" 
        placeholder="Enter your email address" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-[var(--text)] mb-2">Password</label>
          <a href="#" className="text-xs text-[var(--muted)] hover:text-[var(--text)]">Forgot password?</a>
        </div>
        <Input 
          id="password" 
          type="password" 
          autoComplete="current-password" 
          placeholder="Enter your password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="mt-2">{loading ? 'Signing in…' : 'Sign in'}</Button>
    </form>
  );
}
