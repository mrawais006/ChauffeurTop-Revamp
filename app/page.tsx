import type { Metadata } from "next";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: "ChauffeurTop | Premium Melbourne Chauffeur Service & Airport Transfers",
  description: "Melbourne's premier luxury chauffeur service. Professional airport transfers, corporate travel, wedding transport & executive car hire. Book your premium chauffeur today.",
  keywords: ["chauffeur melbourne", "airport transfer melbourne", "corporate chauffeur", "luxury car hire melbourne", "wedding car melbourne", "executive chauffeur service"],
  alternates: {
    canonical: "https://chauffeurtop.com.au",
  },
  openGraph: {
    title: "ChauffeurTop | Premium Melbourne Chauffeur Service",
    description: "Melbourne's premier luxury chauffeur service. Professional airport transfers, corporate travel & executive car hire.",
    url: "https://chauffeurtop.com.au",
    type: "website",
  },
};

export default function Home() {
  return <HomeContent />;
}
