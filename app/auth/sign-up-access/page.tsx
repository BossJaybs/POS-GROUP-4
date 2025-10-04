import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-center text-foreground">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent you a confirmation email. Please check your inbox and click the link to verify your
              account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center text-muted-foreground">
              After confirming your email, you can{" "}
              <Link href="/auth/login" className="text-primary underline underline-offset-4">
                login to your account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
