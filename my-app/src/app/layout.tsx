import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from '../context/AuthProvider'; // Corrected capitalization
import { Toaster } from "@/components/ui/toaster"
// Define custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the application
export const metadata: Metadata = {
  title: "AR FACE STUDIO",
  description: "by Walee Technologies", // Capitalized "Technologies" for consistency
};

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Type for children prop
}>) {
  return (
    <html lang="en">
      <AuthProvider> {/* Wrap children with AuthProvider for authentication context */}
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children} 
          <Toaster/>{/* Render children components here */}
        </body>
      </AuthProvider>
    </html>
  );
}
