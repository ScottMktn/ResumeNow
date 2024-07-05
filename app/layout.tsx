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
        <div className="bg-yellow-50 min-h-screen flex flex-col items-center">
          <nav className="text-white w-full border-b border-dashed border-yellow-300">
            <div className="max-w-3xl w-full flex justify-between items-center mx-auto">
              <div className="w-full px-8 py-4 border-l border-r border-yellow-300">
                <Link href="/">
                  <p className="text-xl font-bold text-black">
                    Resume<span className="text-amber-500">Now</span>
                  </p>
                </Link>
              </div>
            </div>
          </nav>
          <div className="w-full text-black">
            <div className="max-w-3xl w-full flex justify-between items-center mx-auto">
              <div className="w-full px-8 py-4 border-l border-r border-yellow-300">
                {children}
              </div>
            </div>
          </div>
          <footer className="text-black w-full border-t border-dashed border-yellow-300 text-sm text-bold">
            <div className="max-w-3xl w-full flex justify-between items-center mx-auto">
              <div className="w-full px-8 py-4 border-l border-r border-yellow-300 text-bold">
                Made with ❤️ in San Francisco
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
