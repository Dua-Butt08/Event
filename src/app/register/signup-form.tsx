"use client";
import { useState } from 'react';
import { Input } from '@/components/ui-kit/Input';
import { Button } from '@/components/ui-kit/Button';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    // Validate fields
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter a password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        setError(data?.error ?? 'Registration failed. Please try again.');
      } else {
        // Get the callback URL from the current location if available
        const urlParams = new URLSearchParams(window.location.search);
        const callbackUrl = urlParams.get('callbackUrl') || '/login';
        window.location.href = callbackUrl;
      }
    } catch (error) {
      console.error('Registration error:', error);
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
        id="name" 
        label="Name"
        placeholder="Enter your full name" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <Input 
        id="password" 
        label="Password"
        type="password" 
        autoComplete="new-password" 
        placeholder="Create a strong password (min 6 characters)" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Input 
        id="confirm" 
        label="Confirm Password"
        type="password" 
        autoComplete="new-password" 
        placeholder="Confirm your password" 
        value={confirm} 
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading} className="mt-2">{loading ? 'Creating account…' : 'Create account'}</Button>
    </form>
  );
}
