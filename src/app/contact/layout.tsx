import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Brody Lee - Strategic Marketing Consultation',
  description: 'Get in touch with Brody Lee for strategic marketing consultation. Transform your brand with expert marketing strategies that deliver 200% average ROI increase. Start your project today.',
  keywords: [
    'contact marketing consultant',
    'marketing strategy consultation',
    'brand development contact',
    'marketing expert consultation',
    'strategic marketing services',
    'contact Brody Lee',
    'marketing consultation',
    'brand strategy consultation'
  ],
  openGraph: {
    title: 'Contact Brody Lee - Strategic Marketing Consultation',
    description: 'Get in touch with Brody Lee for strategic marketing consultation. Transform your brand with expert marketing strategies.',
    url: '/contact',
    type: 'website',
  },
  twitter: {
    title: 'Contact Brody Lee - Strategic Marketing Consultation',
    description: 'Get in touch with Brody Lee for strategic marketing consultation. Transform your brand with expert marketing strategies.',
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}