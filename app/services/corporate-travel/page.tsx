import type { Metadata } from "next";
import CorporateTravelContent from "./CorporateTravelContent";

export const metadata: Metadata = {
    title: "Corporate Chauffeur Melbourne | Executive Travel Services - ChauffeurTop",
    description: "Premium corporate chauffeur services in Melbourne. Monthly billing, dedicated account manager, NDA-compliant drivers. Professional executive travel for businesses.",
    keywords: ["corporate chauffeur melbourne", "executive car service", "business travel melbourne", "corporate travel service", "executive chauffeur hire"],
    alternates: {
        canonical: "https://chauffeurtop.com.au/services/corporate-travel",
    },
    openGraph: {
        title: "Corporate Chauffeur Melbourne | ChauffeurTop",
        description: "Premium corporate chauffeur services with monthly billing and dedicated account management.",
        url: "https://chauffeurtop.com.au/services/corporate-travel",
        type: "website",
    },
};

export default function CorporateTravelPage() {
    return <CorporateTravelContent />;
}
