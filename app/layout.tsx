import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { Toaster } from "sonner";


import Script from "next/script";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChauffeurTop | Premium Australian Chauffeur Service Melbourne",
  description: "Melbourne's premier luxury chauffeur service. Professional corporate transfers, airport pickups, wedding transport & executive car hire across Victoria. Book your premium Australian chauffeur today.",
  keywords: ["chauffeur melbourne", "corporate transfer melbourne", "airport transfer melbourne", "luxury car hire victoria", "executive chauffeur australia", "wedding car melbourne"],
  authors: [{ name: "ChauffeurTop" }],
  creator: "ChauffeurTop",
  publisher: "ChauffeurTop",
  icons: {
    icon: '/logo/fav.ico',
    apple: '/logo/fav.ico',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ChauffeurTop',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://chauffeurtop.com.au",
    siteName: "ChauffeurTop",
    title: "ChauffeurTop | Premium Australian Chauffeur Service Melbourne",
    description: "Melbourne's premier luxury chauffeur service. Professional corporate transfers, airport pickups, wedding transport & executive car hire across Victoria.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChauffeurTop - Premium Melbourne Chauffeur Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChauffeurTop | Premium Australian Chauffeur Service Melbourne",
    description: "Melbourne's premier luxury chauffeur service. Professional corporate transfers, airport pickups & executive car hire.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// LocalBusiness Schema for Australian Chauffeur Service
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://chauffeurtop.com.au/#organization",
  "name": "ChauffeurTop",
  "alternateName": "ChauffeurTop Melbourne",
  "description": "Premium Australian chauffeur service providing luxury corporate transfers, airport pickups, wedding transport and executive car hire across Melbourne and Victoria.",
  "url": "https://chauffeurtop.com.au",
  "telephone": "+61430240945",
  "email": "bookings@chauffeurtop.com.au",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "3/199 Greenvale Dr",
    "addressLocality": "Greenvale",
    "addressRegion": "VIC",
    "postalCode": "3059",
    "addressCountry": "AU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -37.6419,
    "longitude": 144.8847
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Melbourne"
    },
    {
      "@type": "State",
      "name": "Victoria"
    }
  ],
  "serviceType": ["Chauffeur Service", "Airport Transfer", "Corporate Travel", "Wedding Transport", "Executive Car Hire"],
  "priceRange": "$$$$",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "sameAs": [
    "https://www.facebook.com/chauffeurtop",
    "https://www.instagram.com/chauffeurtop",
    "https://www.linkedin.com/company/chauffeurtop"
  ],
  "image": "https://chauffeurtop.com.au/logo/logo-1.png",
  "logo": "https://chauffeurtop.com.au/logo/logo-1.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA Theme Color */}
        <meta name="theme-color" content="#C5A572" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/logo/fav.ico" />
        
        {/* LocalBusiness Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5QV92NKK');`,
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-luxury-black text-white font-sans`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5QV92NKK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
