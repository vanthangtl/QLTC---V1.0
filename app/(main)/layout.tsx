import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const userData = {
    name: user.email?.split("@")[0] || "User",
    email: user.email || "",
    avatar: "" // Fallback avatar
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar user={userData} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="text-sm font-medium text-muted-foreground">Ứng dụng Tài chính</span>
          </header>
          <main className="flex flex-1 flex-col gap-6 p-6 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
