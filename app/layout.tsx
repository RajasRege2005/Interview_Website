import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interview Master - Practice & Excel",
  description: "Master your interview skills with AI-powered feedback and analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineProvider>
          <div className="min-h-screen bg-background">
            <AuthProvider>
              <ScrollToTop />
              <Navbar />
              <div className="pt-20">
                {children}
              </div>
            </AuthProvider>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
