import type { Metadata } from "next"; // 1. Import the Metadata type
import "./globals.css";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "sonner";
import AppShell from "@/components/layout/AppShell";
// 2. Define and export your metadata object
export const metadata: Metadata = {
  title: "NovaShop | Premium Shopping Experience",
  description: "Discover premium products with a modern shopping experience.",
};

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
        <Toaster position="top-right" richColors closeButton duration={3000} />
      </body>
    </html>
  );
}
