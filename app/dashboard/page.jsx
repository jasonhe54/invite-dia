"use client";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // PLACEHOLDER: Add auth check here
  // useEffect(() => {
  //   // Check if user is authenticated
  //   const checkAuth = async () => {
  //     const isAuthenticated = await yourAuthApi.checkAuth()
  //     if (!isAuthenticated) {
  //       router.push('/auth/login')
  //     }
  //   }
  //   checkAuth()
  // }, [router])

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")

    try {
      // Call the API route to submit the email
      const response = await fetch("/api/submit-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast.success("Your email has been submitted successfully.")
        // Clear the form
        event.currentTarget.reset()
      } else {
        const data = await response.json()
        toast.error(data.message || "Failed to submit email.")
      }
    } catch (error) {
      toast.error("An error occurred while submitting your email.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleLogout() {
    // PLACEHOLDER: Replace with your actual logout logic
    // await yourAuthApi.logout()

    toast.success("You have been logged out successfully.")
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
          <CardDescription>Submit your email address for processing</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Email"}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
