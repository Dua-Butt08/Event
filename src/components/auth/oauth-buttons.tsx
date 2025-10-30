"use client";
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react';

export function OAuthButtons() {
  const [callbackUrl, setCallbackUrl] = useState('/dashboard');

  useEffect(() => {
    // Get callback URL from query parameters after component mounts
    const urlParams = new URLSearchParams(window.location.search);
    const urlCallback = urlParams.get('callbackUrl') || '/dashboard';
    setCallbackUrl(urlCallback);
  }, []);

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => signIn('google', { callbackUrl })}
        aria-label="Sign in with Google"
      >
        <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
            <path fill="var(--error)" d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.7-2.6-5.7-5.7s2.6-5.7 5.7-5.7c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.9 3.9 14.7 3 12 3 6.9 3 2.7 7.2 2.7 12.3S6.9 21.6 12 21.6c6.4 0 8.7-4.5 8.7-7.6 0-.5 0-.9-.1-1.3H12z"/>
          </svg>
        </span>
        Continue with Google
      </Button>
    </div>
  )
}
