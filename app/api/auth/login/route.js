import { cookies } from "next/headers"
import { NextResponse } from "next/server";
import { routes as api } from "@/config/routes"

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    let call = await fetch(api.DIA_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "password": password
      }),
    })

    if (!call.ok) {
      return NextResponse.json({ message: "Login failed. Please check your credentials." }, { status: 401 });
    }
    const data = await call.json();
    console.log("Login successful:", data)

    let accessToken = data.result.token;
    let refreshToken = data.result.refreshToken;

    // Set cookies
    const cookieStore = cookies()

    // Set access token cookie (JWT)
    await cookieStore.set({
      name: "authToken",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // expire when token expires or after 15 minutes
      maxAge: data.result.expiresIn || 60 * 15, // Default to 15 minutes if not provided
    })

    // Set refresh token cookie
    await cookieStore.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // Longer expiry for refresh token (e.g., 7 days)
      maxAge: 60 * 60 * 24 * 7,
    })

    // get user profile
    let userCall = await fetch(api.DIA_USER_PROFILE_ATTRIBUTES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, // Use the access token for authentication
      },
    })
    if (!userCall.ok) {
      return NextResponse.json({ message: "Failed to fetch user profile." }, { status: 500 });
    }
    const userData = await userCall.json();

    console.log("User data fetched:", userData);

    // Return user data (but not the tokens - they're in the cookies)
    return NextResponse.json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
