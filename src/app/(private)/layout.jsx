import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function PrivateLayout({ children }) {
  return (
      <div>
        <SidebarProvider>
          <AppSidebar />
          <main className="pl-2"> {/* padding à esquerda pra não sobrepor */}
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </div>
  );
}
