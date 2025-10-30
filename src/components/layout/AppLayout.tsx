import { Sidebar, MobileSidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - Always visible on lg screens and above */}
      <Sidebar className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-background" />
      
      {/* Mobile Sidebar - Only visible on smaller screens (< lg) */}
      <MobileSidebar />
      
      {/* Main Content - Adjust margin for larger screens */}
      <div className="flex-1 lg:ml-64 bg-background">
        {children}
      </div>
    </div>
  );
}