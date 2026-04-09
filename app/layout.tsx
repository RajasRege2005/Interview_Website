import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RehearseAI - Practice & Excel",
  description: "Master your interview skills with AI-powered feedback and analysis",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <AuthProvider>
            <ScrollToTop />
            <Navbar />
            <div className="pt-20">
              {children}
            </div>
            <Footer />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
