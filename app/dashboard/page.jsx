"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCount, setInviteCount] = useState(0);
  const [email, setEmail] = useState(user?.email || "");  // Track email input value

  // Protect this route
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // fetch invite status on load
  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/queryInvites", {
        method: "POST",
        credentials: "include", // Include cookies in the request
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            toast.error(data.message);
          } else {
            setInviteCount(data.remainingInvites);
            toast.info("Invite Summary", {
              duration: 30000,
              description: `Used Invites: ${data.usedInvites}, Remaining Invites: ${data.remainingInvites}`,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching invite status:", error);
          toast.error("Failed to fetch invite status.");
        });
    }
  }, [isAuthenticated]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Call the API route to submit the email
      const response = await fetch("/api/send-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include", // Include cookies in the request
      });

      if (response.ok) {
        let responseData = await response.json();
        console.log("Response data:", responseData);
        toast.success("The invite has been sent successfully!", {
          duration: 5000,
          description: `An invite has been sent to ${email}. You have ${responseData.result.summary.remaining} invite(s) remaining.`,
        });
      } else {
        const data = await response.json();
        let title = data.errorTitle;
        let description = data.errorMessage;
        if (title && description) {
          title = "From Dia API: " + title;
          description = "From Dia API: " + description;
        } else {
          title = "Failed to submit email.";
          description = "An error occurred while sending the invite.";
        }

        toast.error(title, {
          duration: 5000,
          description: description,
        });
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      toast.error("An error occurred while sending the invite.", {
        duration: 5000,
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setEmail("");
      setIsLoading(false);
    }
  }

  // for testing - can probably remove later
  async function handleRefreshToken() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/refreshToken", {
        method: "POST",
        credentials: "include", // Include cookies in the request
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Token refreshed successfully.")
        console.log("New token data:", data)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to refresh token.")
      }
    } catch (error) {
      toast.error("An error occurred while refreshing the token.")
    } finally {
      setIsLoading(false)
    }
  }

  // If not authenticated, show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Invite a User</CardTitle>
          <CardDescription>
            Enter an email below to send a Dia Invite to that user. We do NOT store ANY information regarding usage of this tool.
          </CardDescription>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}  // Update state on change
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading || inviteCount <= 0}>
              {isLoading ? "Inviting..." : "Invite"}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={logout}>
              Logout
            </Button>
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
