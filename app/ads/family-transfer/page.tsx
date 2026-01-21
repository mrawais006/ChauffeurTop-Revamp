import type { Metadata } from "next";
import FamilyTransferContent from "./FamilyTransferContent";

export const metadata: Metadata = {
    title: "Safe Family Transfers Melbourne | Child Seats Included - ChauffeurTop",
    description: "Safe family transfers in Melbourne with complimentary child seats, vetted drivers, and spacious vehicles. Stress-free travel for families with kids. Book now!",
    keywords: ["family transfer melbourne", "child seat car hire", "safe family transport", "family airport transfer", "kids car seat chauffeur"],
    robots: { index: false, follow: false },
    alternates: {
        canonical: "https://chauffeurtop.com.au/ads/family-transfer",
    },
    openGraph: {
        title: "Safe Family Transfers Melbourne | ChauffeurTop",
        description: "Safe family transfers with complimentary child seats and vetted drivers.",
        url: "https://chauffeurtop.com.au/ads/family-transfer",
        type: "website",
    },
};

export default function FamilyTransferLanding() {
  return <FamilyTransferContent />;
}
