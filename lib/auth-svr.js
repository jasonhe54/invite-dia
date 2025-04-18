'use server';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Helper function to refresh the token
export default async function refreshToken(request) {
  // Get the refresh token from cookies
  const cookieStore = cookies();
  const refreshCookie = cookieStore.get("refreshToken")?.value;
  if (!refreshCookie) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  // Call your refresh token endpoint.
  const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refreshToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refreshCookie })
  });

  if (!refreshResponse.ok) {
      return NextResponse.json({ message: "Session expired" }, { status: 401 });
  }

  // Assume your refresh endpoint sets the new cookies and returns user data.
  const data = await refreshResponse.json();
  return NextResponse.json(data.result);
}