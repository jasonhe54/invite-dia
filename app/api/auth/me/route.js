import { cookies } from "next/headers"
import { NextResponse } from "next/server";
import { getUserFromToken, isTokenExpired } from "@/lib/auth"
import refreshToken from "@/lib/auth-svr";

export async function GET(request) {
  try {
    // Get the auth token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("authToken")?.value

    // If no token, user is not authenticated
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      // Try to refresh the token
      return await refreshToken(request);
    }

    // Get user data from token
    const userData = getUserFromToken(token)

    // Return user data
    return NextResponse.json({
      user: userData,
    });
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
