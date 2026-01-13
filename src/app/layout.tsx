import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers";
import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = { title: "JobFlow", description: "Job Application Tracker" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
