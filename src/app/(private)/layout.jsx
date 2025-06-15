import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from 'sonner';

export default function PrivateLayout({ children }) {
  return (
      <div>
        <SidebarProvider>
          <AppSidebar />
          <main className="pl-2"> {/* padding à esquerda pra não sobrepor */}
            <SidebarTrigger />
            {children}
            <Toaster richColors position="top-right" />
          </main>
        </SidebarProvider>
      </div>
  );
}
