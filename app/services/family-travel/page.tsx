import type { Metadata } from "next";
import FamilyTravelContent from "./FamilyTravelContent";

export const metadata: Metadata = {
    title: "Family Chauffeur Melbourne | Child Seats Included - ChauffeurTop",
    description: "Safe family chauffeur service in Melbourne with complimentary child seats, spacious vehicles, and vetted drivers. Stress-free travel for families with kids.",
    keywords: ["family chauffeur melbourne", "family transfer service", "child seat car hire", "family airport transfer melbourne", "safe family transport"],
    alternates: {
        canonical: "https://chauffeurtop.com.au/services/family-travel",
    },
    openGraph: {
        title: "Family Chauffeur Melbourne | ChauffeurTop",
        description: "Safe family chauffeur service with complimentary child seats and vetted drivers.",
        url: "https://chauffeurtop.com.au/services/family-travel",
        type: "website",
    },
};

export default function FamilyTravelPage() {
    return <FamilyTravelContent />;
}
