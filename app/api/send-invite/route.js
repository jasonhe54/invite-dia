import { cookies } from "next/headers"
import { NextResponse } from "next/server";
import { getUserFromToken, isTokenExpired } from "@/lib/auth"
import { routes as api } from "@/config/routes";

export async function POST(request) {
  try {
    // Get the auth token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("authToken")?.value

    // Check if the token exists and is valid
    if (!token || isTokenExpired(token)) {
      return NextResponse.json({ message: "Unauthorized. Try Signing Out and Back In?" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Invalid email address. Please double check." }, { status: 400 });
    }
    
    // send to Dia API:
    const response = await fetch(api.DIA_INVITE_USER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Use the access token for authentication
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Dia API:", errorData);
      return NextResponse.json({ 
        message: "Failed to send invite. Please try again.",
        errorTitle: errorData.error || "Unknown error",
        errorMessage: errorData.user_message || "An error occurred while processing your request."
       }, { status: response.status });
    }
    const data = await response.json();
    console.log("Invite sent successfully:", data);

    // Return success response
    return NextResponse.json({ message: "Email submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing email submission:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
