import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import Script from "next/script";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { ClientHeader } from "@/components/layout/ClientHeader";
import { Footer } from "@/components/layout/Footer";
import { FlameAmbient } from "@/components/visuals/FlameAmbient";
import { LoadingBar } from "@/components/ui/loading-bar";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const inter = Inter({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const generateViewport = (): Viewport => ({
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'var(--accent)' },
    { media: '(prefers-color-scheme: dark)', color: 'var(--accent)' },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "Brody Lee Marketing - Strategic Marketing & Brand Development",
    template: "%s | Brody Lee Marketing"
  },
  description: "Transform your brand with strategic marketing solutions by Brody Lee. Specializing in brand development, digital marketing campaigns, content strategy, and data-driven marketing that delivers 200% average ROI increase.",
  keywords: [
    "strategic marketing",
    "brand development",
    "digital marketing",
    "content strategy",
    "marketing consultant",
    "brand strategy",
    "marketing campaigns",
    "ROI optimization",
    "business growth",
    "marketing expert",
    "Brody Lee",
    "marketing strategist",
    "campaign management",
    "brand identity",
    "marketing automation"
  ],
  authors: [{ name: "Brody Lee" }],
  creator: "Brody Lee",
  publisher: "Brody Lee Marketing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://brodyleemarketing.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Brody Lee Marketing - Strategic Marketing & Brand Development",
    description: "Transform your brand with strategic marketing solutions that deliver real results. 200% average ROI increase with data-driven campaigns.",
    url: "https://brodyleemarketing.com",
    siteName: "Brody Lee Marketing",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Brody Lee Marketing - Strategic Marketing Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brody Lee Marketing - Strategic Marketing & Brand Development",
    description: "Transform your brand with strategic marketing solutions that deliver real results. 200% average ROI increase.",
    creator: "@brodyleemarketing",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: 'var(--accent)',
      },
    ],
  },
  manifest: '/manifest.json',
  category: 'business',
  classification: 'Marketing Services',
  referrer: 'origin-when-cross-origin',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Brody Lee Marketing',
    'application-name': 'Brody Lee Marketing',
    'msapplication-TileColor': 'var(--accent)',
    'msapplication-config': '/browserconfig.xml',
 },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get server-side session for initial hydration
  const session = await getServerSession(authOptions);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Brody Lee Marketing',
    description: 'Strategic Marketing & Brand Development Services',
    url: 'https://brodyleemarketing.com',
    telephone: '+1-555-MARKETING',
    email: 'hello@brodyleemarketing.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    founder: {
      '@type': 'Person',
      name: 'Brody Lee',
      jobTitle: 'Strategic Marketing Consultant',
      description: 'Strategic marketing expert with 5+ years of experience in brand development and digital campaigns.',
    },
    serviceType: [
      'Brand Strategy',
      'Digital Marketing',
      'Content Strategy',
      'Campaign Management',
      'Market Research',
      'Marketing Consultation'
    ],
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Marketing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Brand Strategy Development',
            description: 'Comprehensive brand positioning and messaging strategy'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Digital Marketing Campaigns',
            description: 'Data-driven digital marketing campaigns with ROI optimization'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Content Strategy',
            description: 'Strategic content planning and creation for brand growth'
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '50'
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5'
      },
      author: {
        '@type': 'Person',
        name: 'Client Review'
      },
      reviewBody: 'Outstanding strategic marketing expertise that delivered 200% ROI increase.'
    }
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${poppins.variable} ${inter.variable} antialiased relative min-h-[100dvh] bg-background text-fg font-sans`}>
        {/* Google API Scripts - Load before app initializes */}
        <Script
          src="https://apis.google.com/js/api.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
        
        <ClientProviders session={session}>
          <LoadingBar />
          <FlameAmbient />
          <ClientHeader />
          <main className="pt-[93px] lg:pt-[93px]">
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
