import type { Metadata } from "next";
import MelbourneAirportTransferV2Content from "./MelbourneAirportTransferV2Content";

export const metadata: Metadata = {
  title: "Melbourne Airport Transfers | Reliable Chauffeur Service - ChauffeurTop",
  description: "Reliable Melbourne airport transfers with flight tracking, 60 min free wait time, and fixed pricing. Professional chauffeurs, luxury vehicles. Book now!",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://chauffeurtop.com.au/ads/melbourne-airport-transfer",
  },
};

export default function MelbourneAirportTransferV2Landing() {
  return <MelbourneAirportTransferV2Content />;
}
