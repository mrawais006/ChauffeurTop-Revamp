import type { Metadata } from "next";
import CruiseTransfersContent from "./CruiseTransfersContent";

export const metadata: Metadata = {
    title: "Cruise Ship Transfers Melbourne | Station Pier - ChauffeurTop",
    description: "Premium cruise ship transfers to Station Pier and Melbourne cruise terminals. Spacious vehicles for luggage, ship tracking, and door-to-port service.",
    keywords: ["cruise ship transfer melbourne", "station pier transfer", "port melbourne chauffeur", "cruise terminal transfer", "cruise pickup melbourne"],
    alternates: {
        canonical: "https://chauffeurtop.com.au/services/cruise-ship-transfers",
    },
    openGraph: {
        title: "Cruise Ship Transfers Melbourne | ChauffeurTop",
        description: "Premium cruise transfers to Station Pier with spacious vehicles and door-to-port service.",
        url: "https://chauffeurtop.com.au/services/cruise-ship-transfers",
        type: "website",
    },
};

export default function CruiseTransfersPage() {
    return <CruiseTransfersContent />;
}
