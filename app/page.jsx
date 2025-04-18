'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function Home() {
  // immediately send to dashboard - will redir to login if not authenticated
  const router = useRouter();
  router.push("/dashboard");
  

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Please sign in to access the application</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full">Sign In</Button>
          </Link>
        </CardContent>
      </Card> */}
    </div>
  );
}
