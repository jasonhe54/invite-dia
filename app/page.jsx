import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Please sign in to access the application</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full">Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
