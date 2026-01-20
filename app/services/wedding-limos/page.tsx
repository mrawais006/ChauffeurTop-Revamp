import type { Metadata } from "next";
import WeddingLimosContent from "./WeddingLimosContent";

export const metadata: Metadata = {
    title: "Wedding Car Hire Melbourne | Luxury Bridal Transport - ChauffeurTop",
    description: "Luxury wedding car hire in Melbourne. Red carpet service, white ribbons, champagne toast & professional chauffeurs. Make your special day unforgettable.",
    keywords: ["wedding car melbourne", "bridal car hire", "wedding chauffeur melbourne", "luxury wedding transport", "wedding limo melbourne"],
    alternates: {
        canonical: "https://chauffeurtop.com.au/services/wedding-limos",
    },
    openGraph: {
        title: "Wedding Car Hire Melbourne | ChauffeurTop",
        description: "Luxury wedding car hire with red carpet service and professional chauffeurs.",
        url: "https://chauffeurtop.com.au/services/wedding-limos",
        type: "website",
    },
};

export default function WeddingLimosPage() {
    return <WeddingLimosContent />;
}
