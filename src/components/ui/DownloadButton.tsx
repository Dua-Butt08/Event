"use client";

import React, { useState } from 'react';
import { Button } from './button';
import { uploadToGoogleDrive } from '@/lib/google-drive-service';

interface DownloadButtonProps {
  content: string;
  filename: string;
  className?: string;
  label?: string;
  theme?: { primary: string; secondary: string; title?: string };
}

export function DownloadButton({ content, filename, className, label = 'Open in Google Docs' }: DownloadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleSaveToGoogleDrive = async () => {
    try {
      setIsUploading(true);
      
      // Wait longer for scripts to load on first attempt
      if (retryCount === 0) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Upload to Google Drive as Google Docs document
      await uploadToGoogleDrive(content, filename);
      
      // Reset retry count on success
      setRetryCount(0);
      
    } catch (error: unknown) {
      console.error('Error saving to Google Docs:', error);
      
      // User-friendly error message
      let errorMessage = 'Unable to create document. Please try again.';
      let canRetry = true;
      
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      if (errorMsg?.includes('credentials not configured')) {
        errorMessage = 'Google Docs integration is not set up yet. Please contact support.';
        canRetry = false;
      } else if (errorMsg?.includes('failed to load') || errorMsg?.includes('Unable to load') || errorMsg?.includes('still loading')) {
        errorMessage = 'Google services are still loading. Please wait a moment and try again.';
      } else if (errorMsg?.includes('popup')) {
        errorMessage = 'Please allow popups for this site to use Google Docs integration.';
      } else if (errorMsg?.includes('internet connection')) {
        errorMessage = 'Please check your internet connection and try again.';
      }
      
      // Auto-retry up to 2 times if it's a loading issue
      if (canRetry && retryCount < 2 && (errorMsg?.includes('loading') || errorMsg?.includes('failed to load'))) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => handleSaveToGoogleDrive(), 3000);
        return;
      }
      
      alert(`❌ ${errorMessage}`);
      setRetryCount(0); // Reset on final error
    } finally {
      if (retryCount === 0) {
        setIsUploading(false);
      }
    }
  };

  return (
    <Button
      onClick={handleSaveToGoogleDrive}
      variant="outline"
      size="sm"
      className={className}
      disabled={isUploading}
    >
      {isUploading ? (
        <>
          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Uploading...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {label}
        </>
      )}
    </Button>
  );
}
