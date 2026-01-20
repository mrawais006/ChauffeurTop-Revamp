import type { Metadata } from "next";
import CorporateTransferContent from "./CorporateTransferContent";

export const metadata: Metadata = {
    title: "Melbourne Corporate Transfers | Executive Chauffeur Service - ChauffeurTop",
    description: "Executive corporate transfers in Melbourne. Monthly billing, NDA-compliant drivers, dedicated account manager. Work while you travel. Book now!",
    keywords: ["corporate transfer melbourne", "executive chauffeur service", "business travel melbourne", "corporate car hire", "monthly billing chauffeur"],
    alternates: {
        canonical: "https://chauffeurtop.com.au/ads/corporate-transfer",
    },
    openGraph: {
        title: "Melbourne Corporate Transfers | ChauffeurTop",
        description: "Executive corporate transfers with monthly billing and dedicated account management.",
        url: "https://chauffeurtop.com.au/ads/corporate-transfer",
        type: "website",
    },
};

export default function CorporateTransferLanding() {
  return <CorporateTransferContent />;
}
