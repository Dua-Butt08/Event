import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardCards } from "./components/DashboardCards";
import { StrategyOverview } from "./components/StrategyOverview";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <AppLayout>
      <div className="relative min-h-[100dvh] bg-background">
        <div className="relative z-10 pt-20 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 text-center">
              <div className="mb-6 inline-flex items-center space-x-2 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-2)]/10 border border-[var(--accent)]/20 px-6 py-3 rounded-full backdrop-blur-sm">
                <span className="text-[var(--accent)] font-semibold">📊 Dashboard</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent pb-2">
                Events Expert
              </h1>
              
              <p className="text-lg text-[var(--muted)] max-w-3xl mx-auto leading-relaxed mb-6">
                Access your complete marketing strategy components. Click any card to view detailed insights.
              </p>
              
              <Link href="/audience-architect?new=true">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] hover:shadow-xl hover:shadow-[var(--accent)]/20 hover:scale-105 transition-all duration-300 px-8 py-6 text-lg"
                >
                  <span className="flex items-center space-x-2">
                    <span>✨</span>
                    <span>Create New Strategy</span>
                    <span>→</span>
                  </span>
                </Button>
              </Link>
            </div>

            {/* Dashboard Cards */}
            <div className="mb-16">
              <DashboardCards />
            </div>

            {/* Strategy Overview Section */}
            <StrategyOverview />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}