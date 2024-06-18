import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeNow",
  description: "AI-powered modular resume generator for job applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-violet-100 min-h-screen flex flex-col items-center">
          <div className="w-full max-w-2xl text-black py-16 px-4">
            {/* <nav className="flex flex-row space-x-2 w-full">
              <Link href="/">Home</Link>
            </nav> */}
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
