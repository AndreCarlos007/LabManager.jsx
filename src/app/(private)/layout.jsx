import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export default function PrivateLayout({ children }) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 transition-all duration-300 ease-in-out peer-data-[state=collapsed]:ml-0 peer-data-[state=expanded]:ml-0">
          <div className="p-4">
            <SidebarTrigger />
          </div>
          <div className="transition-all duration-300 ease-in-out peer-data-[state=collapsed]:max-w-none peer-data-[state=collapsed]:mx-auto peer-data-[state=collapsed]:px-8 peer-data-[state=expanded]:max-w-none">
            {children}
          </div>
          <Toaster richColors position="top-right" />
        </main>
      </SidebarProvider>
    </div>
  )
}
