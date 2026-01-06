import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { Toaster } from "sonner";


const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Melbourne’s Premier Chauffeur Service",
  description: "Premium Melbourne Chauffeur Service & Executive Car Service Airport Across Victoria",
  icons: {
    icon: '/logo/fav.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-luxury-black text-white font-sans`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
