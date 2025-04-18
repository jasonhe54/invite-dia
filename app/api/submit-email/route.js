import { cookies } from "next/headers"
import { NextResponse } from "next/server";
import { getUserFromToken, isTokenExpired } from "@/lib/auth"

export async function POST(request) {
  try {
    // Get the auth token from cookies
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    // Check if the token exists and is valid
    if (!token || isTokenExpired(token)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get user data from token
    const userData = getUserFromToken(token)

    // Parse the request body
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
    }

    // PLACEHOLDER: Process the email (replace with your actual processing logic)
    console.log("Processing email:", email)
    console.log("User from token:", userData)

    // Return success response
    return NextResponse.json({ message: "Email submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing email submission:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
