import { cookies } from "next/headers"
import { NextResponse } from "next/server";
import { isTokenExpired } from "@/lib/auth"
import refreshToken from "@/lib/auth-svr";
import { routes as api } from "@/config/routes";

export async function POST(request) {
  try {
    // Get the auth token from cookies
    const cookieStore = await cookies()
    let token = cookieStore.get("authToken")?.value

    // If no token, user is not authenticated
    if (!token) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
        // Try to refresh the token
        let refreshedTokenData = await refreshToken(request);
        if (refreshedTokenData.status !== 200) {
            return NextResponse.json({ message: "Session expired" }, { status: 401 });
        }
        // Use the new token from the refreshed data
        const refreshedToken = refreshedTokenData.result.token;
        console.log("Token refreshed successfully:", refreshedToken);
        // Update the token in the cookie store
        cookieStore.set({
            name: "authToken",
            value: refreshedToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            Path: "/",
            maxAge: 60 * 15, // Default to 15 minutes if not provided
        });
        // Update the token variable to the refreshed token
        token = refreshedToken;

        // update refresh token in cookies
        const newRefreshToken = refreshedTokenData.result.refreshToken;
        cookieStore.set({
            name: "refreshToken",
            value: newRefreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            Path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
    }

    console.log("Using token:", token);

    let call = await fetch(api.DIA_INVITATIONS_SUMMARY_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Use the access token for authentication
      }
    })

    if (!call.ok) {
      return NextResponse.json({ message: "Fetching Invite Status Failed. Check Auth" }, { status: 401 });
    }

    const data = await call.json();
    console.log("Fetch Success:", data);

    let usedInvites = data.sent;
    let remainingInvites = data.remaining;


    // Return data
    return NextResponse.json({
        usedInvites: usedInvites,
        remainingInvites: remainingInvites
    });
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
