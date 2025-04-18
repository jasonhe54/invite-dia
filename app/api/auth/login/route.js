import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // PLACEHOLDER: This is where you would call your actual auth API
    // const authResponse = await fetch('https://your-auth-api.com/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    //
    // if (!authResponse.ok) {
    //   const error = await authResponse.json();
    //   return NextResponse.json({ message: error.message }, { status: authResponse.status });
    // }
    //
    // const { accessToken, refreshToken, user } = await authResponse.json();

    // Simulate successful authentication
    console.log("Login attempt with:", { email, password })

    // Mock tokens and user data
    const mockAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    const mockRefreshToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2MTYyMzkwMjJ9.4pcPyMD09olPSyXnrXCB4VBtKnQQ9QY5NX_ZBPd_rGE"
    const mockUser = {
      id: "1234567890",
      name: "John Doe",
      email: email,
    }

    // Set cookies
    const cookieStore = cookies()

    // Set access token cookie (JWT)
    cookieStore.set({
      name: "auth_token",
      value: mockAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // Short expiry for access token (e.g., 15 minutes)
      maxAge: 60 * 15,
    })

    // Set refresh token cookie
    cookieStore.set({
      name: "refresh_token",
      value: mockRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // Longer expiry for refresh token (e.g., 7 days)
      maxAge: 60 * 60 * 24 * 7,
    })

    // Return user data (but not the tokens - they're in the cookies)
    return NextResponse.json({
      message: "Login successful",
      user: mockUser,
    });
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
