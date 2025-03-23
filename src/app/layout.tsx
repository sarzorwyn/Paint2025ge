import type { Metadata } from "next";
import { Geist, Barlow } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const balowSans = Barlow({
  subsets: ['latin'],
  weight: ['400', '700'], 
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Paint25ge",
  description: "Visualises Singapore 2025 General election outcomes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${balowSans.className} ${geistSans.className}  antialiased`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
