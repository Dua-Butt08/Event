import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Tools - Events Expert',
  description: 'Administrative tools and utilities',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
