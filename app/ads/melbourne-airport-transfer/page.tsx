import type { Metadata } from "next";
import MelbourneAirportTransferContent from "./MelbourneAirportTransferContent";

export const metadata: Metadata = {
    title: "Melbourne Airport Transfers | Reliable Chauffeur Service - ChauffeurTop",
    description: "Reliable Melbourne airport transfers with flight tracking, 60 min free wait time, and fixed pricing. Professional chauffeurs, luxury vehicles. Book now!",
    keywords: ["melbourne airport transfer", "tullamarine airport chauffeur", "airport pickup melbourne", "reliable airport transfer", "flight tracking chauffeur"],
    robots: { index: false, follow: false },
    alternates: {
        canonical: "https://chauffeurtop.com.au/ads/melbourne-airport-transfer",
    },
    openGraph: {
        title: "Melbourne Airport Transfers | ChauffeurTop",
        description: "Reliable airport transfers with flight tracking and fixed pricing.",
        url: "https://chauffeurtop.com.au/ads/melbourne-airport-transfer",
        type: "website",
    },
};

export default function MelbourneAirportTransferLanding() {
  return <MelbourneAirportTransferContent />;
}
