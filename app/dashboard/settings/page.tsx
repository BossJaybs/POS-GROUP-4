import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Calendar } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).maybeSingle()

  // Format the account creation date
  const createdDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* Appearance settings card with theme toggle */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-foreground">Appearance</CardTitle>
            <CardDescription>Customize how the dashboard looks</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeToggle />
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-foreground">Account Information</CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Full Name */}
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Full Name</p>
                <p className="text-base font-semibold text-foreground">{profile?.full_name || "Not set"}</p>
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Email Address</p>
                <p className="text-base font-semibold text-foreground">{user.email}</p>
              </div>
            </div>

            {/* Account Created Date */}
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Account Created</p>
                <p className="text-base font-semibold text-foreground">{createdDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
