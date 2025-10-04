"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    // Force redirect to landing page
    window.location.href = "/"
  }

  return (
    <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/90" onClick={handleSignOut}>
      Sign Out
    </Button>
  )
}
