import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default function FarmerDashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex min-h-full">
        <aside className="w-64 bg-white border-r">
          <div className="flex flex-col">
            <div className="p-6">
              <h2 className="text-2xl font-bold">Farmer Dashboard</h2>
            </div>
            <div className="px-4">
              <DashboardNav />
            </div>
          </div>
        </aside>
        <main className="flex-1">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    );
  }