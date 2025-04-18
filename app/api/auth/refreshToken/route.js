import { routes as api } from "@/config/routes"
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const cookieStore = await cookies()
        const refreshToken = cookieStore.get("refreshToken")?.value
    
        if (!refreshToken) {
            return NextResponse.json(
                { message: "Not authenticated or missing refresh token" }, 
                { status: 401 });
        }

        let resp = await fetch(api.DIA_AUTH_EXCHANGE_REFRESH_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "refreshToken": refreshToken
            }),
        });

        if (!resp.ok) {
            // Clear access token
            cookieStore.set({
                name: "authToken",
                value: "",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 0, // Expire immediately
            })
        
            // Clear refresh token
            cookieStore.set({
                name: "refreshToken",
                value: "",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 0, // Expire immediately
            })
        }

        const data = await resp.json();
        console.log("Token refresh successful:", data);
        let accessToken = data.result.token;
        let newRefreshToken = data.result.refreshToken;
        let expiresIn = data.result.expiresIn || 60 * 15; // Default to 15 minutes if not provided

        // Set new access token cookie
        cookieStore.set({
            name: "authToken",
            value: accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: expiresIn, // Use the provided expiry time
        });

        // Set new refresh token cookie
        cookieStore.set({
            name: "refreshToken",
            value: newRefreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // Longer expiry for refresh token (e.g., 7 days)
        });

        // Return success response
        return NextResponse.json({
            message: "Token refreshed successfully",
            result: {
                token: accessToken,
                refreshToken: newRefreshToken,
                expiresIn: expiresIn
            }
        });
            

    } catch (error) {
        console.error("Error in refreshToken route:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}