"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface NewFormButtonProps {
  variant?: 'primary' | 'outline' | 'subtle' | 'ghost';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function NewFormButton({ 
  variant = 'primary', 
  className = '',
  size = 'md' 
}: NewFormButtonProps) {
  return (
    <Link href="/audience-architect?new=true" prefetch={true}>
      <Button
        variant={variant}
        size={size}
        className={`${className}`}
      >
        <span className="flex items-center space-x-2">
          <span>✨</span>
          <span>Create New Strategy</span>
        </span>
      </Button>
    </Link>
  );
}
