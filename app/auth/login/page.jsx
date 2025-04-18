"use client";
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      const success = await login(email, password)

      if (success) {
        // Redirect to the email submission page
        // router.push("/dashboard") 
        /// NOTE: Seemingly, nextRouter is buggy and sometimes doesn't work?

        window.location.href  = "/dashboard"; // Use window.location.href to ensure the redirect works
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Invite Dia</CardTitle>
          <CardDescription>Invite people to Dia from any browser. Sign in with Dia below to get started! </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Dia Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Dia Password</Label>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <hr />
            This app does NOT collect or store ANY user information. Your data is sent to Dia to sign into your account and invite users you choose on your behalf.
            <hr />
            Note: This product is not affiliated with or endorsed by Dia, BCNY, or any other relevant legal entity.
            This is an independent project created by a student because another student mentioned it. 
            <hr />
            Usage of this product comes with no expressed or implied warranty.
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => window.open(process.env.NEXT_PUBLIC_GITHUB_REPO_URL, "_blank")}
            >
              <span>View and Contribute To Project on GitHub</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
