import type { Metadata } from "next";
import AirportTransfersContent from "./AirportTransfersContent";

export const metadata: Metadata = {
    title: "Melbourne Airport Transfers | Premium Chauffeur Service - ChauffeurTop",
    description: "Premium Melbourne airport transfers with flight tracking, meet & greet service, and 60 min free wait time. Professional chauffeurs, luxury vehicles. Book your airport transfer today.",
    keywords: ["melbourne airport transfer", "airport chauffeur melbourne", "tullamarine airport transfer", "private airport transfer melbourne", "executive airport transfer"],
    alternates: {
        canonical: "https://chauffeurtop.com.au/services/airport-transfers",
    },
    openGraph: {
        title: "Melbourne Airport Transfers | ChauffeurTop",
        description: "Premium airport transfers with flight tracking, meet & greet service, and luxury vehicles.",
        url: "https://chauffeurtop.com.au/services/airport-transfers",
        type: "website",
    },
};

export default function AirportTransfersPage() {
    return <AirportTransfersContent />;
}
