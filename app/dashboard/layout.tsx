import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SignOutButton } from "@/components/sign-out-button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-primary text-primary-foreground border-b border-border">
          <div className="px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-end gap-2 md:gap-4">
              <span className="text-xs md:text-sm truncate max-w-[150px] md:max-w-none">{user.email}</span>
              <SignOutButton />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
