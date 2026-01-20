import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
    title: "Chauffeur Services Melbourne | Airport, Corporate, Wedding - ChauffeurTop",
    description: "Premium chauffeur services in Melbourne: airport transfers, corporate travel, wedding transport, luxury tours, cruise transfers & more. 10+ years of 5-star service.",
    keywords: ["chauffeur services melbourne", "airport transfer service", "corporate chauffeur", "wedding car hire", "luxury tour melbourne"],
    alternates: {
        canonical: "https://chauffeurtop.com.au/services",
    },
    openGraph: {
        title: "Chauffeur Services Melbourne | ChauffeurTop",
        description: "Premium chauffeur services: airport transfers, corporate travel, wedding transport & more.",
        url: "https://chauffeurtop.com.au/services",
        type: "website",
    },
};

export default function ServicesPage() {
    return <ServicesContent />;
}
