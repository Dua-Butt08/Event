"use client";

/**
 * Google Drive Service
 * Handles uploading files to Google Drive using the Google Picker API and Drive API
 */

declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: { apiKey: string; discoveryDocs?: string[] }) => Promise<void>;
        getToken: () => { access_token: string } | null;
        setToken: (token: { access_token: string } | null) => void;
      };
    };
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: { client_id: string; scope: string; callback: string | ((response: { error?: string; access_token?: string }) => void) }) => {
            callback: string | ((response: { error?: string; access_token?: string }) => void);
            requestAccessToken: (options: { prompt: string }) => void;
          };
          revoke: (token: string) => void;
        };
      };
    };
  }
}

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
// Removed discoveryDocs to avoid 502 errors from Google's Discovery API
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let gapiInited = false;
let gisInited = false;
let tokenClient: {
  callback: string | ((response: { error?: string; access_token?: string }) => void);
  requestAccessToken: (options: { prompt: string }) => void;
};

/**
 * Load the Google API JavaScript library
 */
export function loadGoogleAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    // Check if script is already loaded
    if (window.gapi) {
      resolve();
      return;
    }

    // Wait for script to load (it's already in the HTML head)
    const checkGapi = setInterval(() => {
      if (window.gapi) {
        clearInterval(checkGapi);
        resolve();
      }
    }, 100);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkGapi);
      if (!window.gapi) {
        reject(new Error('Google API failed to load. Please refresh the page and try again.'));
      }
    }, 10000);
  });
}

/**
 * Load the Google Identity Services library
 */
export function loadGoogleIdentityServices(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    // Check if script is already loaded
    if (window.google?.accounts) {
      resolve();
      return;
    }

    // Wait for script to load (it's already in the HTML head)
    const checkGoogle = setInterval(() => {
      if (window.google?.accounts) {
        clearInterval(checkGoogle);
        resolve();
      }
    }, 100);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkGoogle);
      if (!window.google?.accounts) {
        reject(new Error('Google Identity Services failed to load. Please refresh the page and try again.'));
      }
    }, 10000);
  });
}

/**
 * Initialize the Google API client with retry logic (without discovery docs)
 */
export async function initializeGoogleAPI(): Promise<void> {
  if (!GOOGLE_API_KEY || !GOOGLE_CLIENT_ID) {
    throw new Error('Google API credentials not configured. Please set NEXT_PUBLIC_GOOGLE_API_KEY and NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.');
  }

  await loadGoogleAPI();
  
  // Wait 1.5 seconds before first attempt
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const maxRetries = 2;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await new Promise<void>((resolve, reject) => {
        window.gapi.load('client', async () => {
          try {
            // Initialize without discoveryDocs to avoid 502 errors
            await window.gapi.client.init({
              apiKey: GOOGLE_API_KEY,
              // discoveryDocs removed - we'll use direct API calls instead
            });
            gapiInited = true;
            resolve();
          } catch (error) {
            console.error(`GAPI client init error (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
            reject(error);
          }
        });
      });
      
      // Success - exit retry loop
      return;
      
    } catch {
      // If not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        console.log(`Retrying Google API initialization in 3 seconds... (${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
  
  // All retries failed
  throw new Error('Google services are temporarily unavailable. Please try again in a few moments.');
}

/**
 * Initialize the Google Identity Services
 */
export async function initializeGoogleIdentity(): Promise<void> {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google Client ID not configured');
  }

  await loadGoogleIdentityServices();
  
  try {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: '', // Will be set per request
    });
    
    gisInited = true;
  } catch (error) {
    console.error('GIS init error:', error);
    throw new Error('Unable to initialize Google sign-in. Please refresh the page and try again.');
  }
}

/**
 * Request access token from Google
 */
function getAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      tokenClient.callback = (response: { error?: string; access_token?: string }) => {
        if (response.error) {
          reject(response);
          return;
        }
        if (response.access_token) {
          resolve(response.access_token);
        } else {
          reject(new Error('No access token received'));
        }
      };

      // Check if already authenticated
      if (window.gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        // Skip display of account chooser and consent dialog
        tokenClient.requestAccessToken({ prompt: '' });
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Upload text content to Google Drive as a Google Docs document
 */
export async function uploadToGoogleDrive(
  content: string,
  filename: string
): Promise<void> {
  try {
    // Initialize if not already done
    if (!gapiInited) {
      await initializeGoogleAPI();
    }
    if (!gisInited) {
      await initializeGoogleIdentity();
    }

    // Get access token
    await getAccessToken();

    // Create file metadata for Google Docs
    const fileMetadata = {
      name: filename.replace(/\.pdf$/, ''), // Remove .pdf extension
      mimeType: 'application/vnd.google-apps.document', // Google Docs MIME type
    };

    // Create form data
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
    // Upload as plain text, Google will convert to Docs format
    form.append('file', new Blob([content], { type: 'text/plain' }));

    // Upload to Google Drive
    const accessToken = window.gapi.client.getToken()?.access_token;
    if (!accessToken) {
      throw new Error('No access token available');
    }
    
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Google Drive API error:', response.status, errorBody);
      
      if (response.status === 403) {
        // Check if it's an API not enabled error
        if (errorBody.includes('SERVICE_DISABLED') || errorBody.includes('accessNotConfigured')) {
          throw new Error('Google Drive integration is not fully configured. Please contact support.');
        }
        throw new Error('Permission denied. Please try again.');
      }
      
      throw new Error(`Upload failed. Please try again.`);
    }

    const result = await response.json();
    
    // Open the document in Google Docs in a new tab
    const docsUrl = `https://docs.google.com/document/d/${result.id}/edit`;
    const newWindow = window.open(docsUrl, '_blank');
    
    if (!newWindow) {
      // Popup was blocked, provide fallback
      alert(`✅ Successfully saved to Google Docs!

Document: ${fileMetadata.name}

Popup blocked. Click OK to open the document.`);
      window.location.href = docsUrl;
    } else {
      // Show success message
      alert(`✅ Successfully saved to Google Docs!

Document: ${fileMetadata.name}

Opening in new tab...`);
    }
    
  } catch (error: unknown) {
    console.error('Error uploading to Google Drive:', error);
    
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    if (errorMsg?.includes('credentials not configured')) {
      throw new Error('Google Drive integration is not configured. Please contact support.');
    }
    
    throw new Error(`Failed to upload to Google Drive: ${errorMsg || 'Unknown error'}`);
  }
}

/**
 * Upload HTML content as Google Docs document
 */
export async function uploadHTMLAsGoogleDoc(
  htmlContent: string,
  filename: string
): Promise<void> {
  // Upload as HTML, Google Docs will convert it
  const docFilename = filename.replace(/\.(txt|html|pdf)$/, '');
  
  await uploadToGoogleDrive(htmlContent, docFilename);
}

/**
 * Sign out from Google
 */
export function signOutFromGoogle(): void {
  const token = window.gapi?.client?.getToken();
  if (token !== null) {
    window.google.accounts.oauth2.revoke(token.access_token);
    window.gapi.client.setToken(null);
  }
}
