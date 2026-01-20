import type { Metadata } from "next";
import FleetContent from "./FleetContent";

export const metadata: Metadata = {
    title: "Our Premium Fleet | Luxury Vehicles Melbourne - ChauffeurTop",
    description: "Explore ChauffeurTop's luxury fleet of sedans, SUVs, vans & minibuses. Immaculately maintained vehicles for airport transfers, corporate travel & special events in Melbourne.",
    keywords: ["luxury car fleet melbourne", "chauffeur vehicles", "executive sedan hire", "luxury suv melbourne", "corporate car hire fleet"],
    alternates: {
        canonical: "https://chauffeurtop.com.au/fleet",
    },
    openGraph: {
        title: "Our Premium Fleet | ChauffeurTop Melbourne",
        description: "Explore ChauffeurTop's luxury fleet of sedans, SUVs, vans & minibuses for all occasions.",
        url: "https://chauffeurtop.com.au/fleet",
        type: "website",
    },
};

export default function FleetPage() {
    return <FleetContent />;
}
