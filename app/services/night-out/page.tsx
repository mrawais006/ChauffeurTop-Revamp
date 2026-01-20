import type { Metadata } from "next";
import NightOutContent from "./NightOutContent";

export const metadata: Metadata = {
    title: "VIP Night Out Chauffeur Melbourne | Hourly Hire - ChauffeurTop",
    description: "VIP night out chauffeur service in Melbourne. Hourly hire, multiple stops, premium vehicles with tinted windows. Enjoy Melbourne nightlife in style and safety.",
    keywords: ["night out chauffeur melbourne", "vip chauffeur service", "hourly car hire melbourne", "nightlife chauffeur", "late night transfer melbourne"],
    alternates: {
        canonical: "https://chauffeurtop.com.au/services/night-out",
    },
    openGraph: {
        title: "VIP Night Out Chauffeur Melbourne | ChauffeurTop",
        description: "VIP night out chauffeur service with hourly hire and premium vehicles.",
        url: "https://chauffeurtop.com.au/services/night-out",
        type: "website",
    },
};

export default function NightOutPage() {
    return <NightOutContent />;
}
