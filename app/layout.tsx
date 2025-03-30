import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeNow",
  description: "AI-powered modular resume generator for job applications",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="bg-yellow-50 min-h-screen flex flex-col items-center">
            <nav className="w-full border-b border-dashed border-yellow-300 justify-between">
              <header className="flex justify-between w-full items-center gap-4 h-16 text-black border-yellow-300 border-dashed mx-auto max-w-3xl border-l border-r px-8">
                <Link href="/">
                  <p className="text-xl font-bold text-black">
                    Resume<span className="text-amber-500">Now</span>
                  </p>
                </Link>
                <div className="flex items-center gap-8">
                  <SignedOut>
                    <SignInButton />
                    <SignUpButton />
                  </SignedOut>
                  <SignedIn>
                    <Link
                      href="/home"
                      className="text-sm text-gray-600 hover:text-black font-medium"
                    >
                      Home
                    </Link>
                    <Link
                      href="/history"
                      className="text-sm text-gray-600 hover:text-black font-medium"
                    >
                      History
                    </Link>
                    <UserButton />
                  </SignedIn>
                </div>
              </header>
            </nav>
            <div className="w-full text-black">
              <div className="max-w-3xl w-full flex justify-between items-center mx-auto">
                <div className="w-full px-8 py-4 border-l border-r border-dashed border-yellow-300 min-h-[90vh]">
                  {children}
                </div>
              </div>
            </div>
            <footer className="text-black w-full border-t border-dashed border-yellow-300 text-sm text-bold">
              <div className="max-w-3xl w-full flex justify-between items-center mx-auto">
                <div className="w-full px-8 py-4 border-l border-r border-dashed border-yellow-300 text-bold">
                  Made with ❤️ in San Francisco
                </div>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
