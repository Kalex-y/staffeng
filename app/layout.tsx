import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "staffeng.co — Senior Staff Engineers for Hire",
  description:
    "Hire senior staff engineers to lead agentic engineering and build product & platform features. No recruiters, no agencies.",
  openGraph: {
    title: "staffeng.co — Senior Staff Engineers for Hire",
    description:
      "Hire senior staff engineers to lead agentic engineering and build product & platform features.",
    url: "https://staffeng.co",
    siteName: "staffeng.co",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-white text-gray-900`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
