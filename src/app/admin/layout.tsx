import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}