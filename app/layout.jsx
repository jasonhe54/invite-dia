import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Invite Dia",
  description: "Send Dia Invites from ANY browser.",
}

export default function RootLayout({
  children
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
