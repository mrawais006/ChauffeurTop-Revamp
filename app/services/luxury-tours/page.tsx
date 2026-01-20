import type { Metadata } from "next";
import LuxuryToursContent from "./LuxuryToursContent";

export const metadata: Metadata = {
    title: "Yarra Valley Wine Tours | Private Chauffeur Melbourne - ChauffeurTop",
    description: "Private Yarra Valley wine tours with luxury chauffeur service. Custom itineraries, door-to-door pickup, and premium vehicles. Taste freely, travel safely.",
    keywords: ["yarra valley wine tour", "private wine tour melbourne", "luxury tour chauffeur", "winery tour melbourne", "mornington peninsula tour"],
    alternates: {
        canonical: "https://chauffeurtop.com.au/services/luxury-tours",
    },
    openGraph: {
        title: "Yarra Valley Wine Tours | ChauffeurTop",
        description: "Private wine tours with luxury chauffeur service. Custom itineraries and door-to-door pickup.",
        url: "https://chauffeurtop.com.au/services/luxury-tours",
        type: "website",
    },
};

export default function LuxuryToursPage() {
    return <LuxuryToursContent />;
}
