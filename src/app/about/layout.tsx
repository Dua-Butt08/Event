import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Brody Lee - Strategic Marketing Expert & Brand Developer',
  description: 'Learn about Brody Lee, a strategic marketing expert with 5+ years of experience. Specializing in brand development, digital campaigns, and data-driven marketing strategies that deliver proven results.',
  keywords: [
    'about Brody Lee',
    'marketing expert',
    'brand strategist',
    'marketing consultant biography',
    'strategic marketing expert',
    'brand development specialist',
    'marketing strategist experience',
    'digital marketing expert'
  ],
  openGraph: {
    title: 'About Brody Lee - Strategic Marketing Expert & Brand Developer',
    description: 'Learn about Brody Lee, a strategic marketing expert with 5+ years of experience in brand development and digital campaigns.',
    url: '/about',
    type: 'profile',
  },
  twitter: {
    title: 'About Brody Lee - Strategic Marketing Expert & Brand Developer',
    description: 'Learn about Brody Lee, a strategic marketing expert with 5+ years of experience in brand development and digital campaigns.',
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}