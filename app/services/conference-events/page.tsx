import type { Metadata } from "next";
import ConferenceEventsContent from "./ConferenceEventsContent";

export const metadata: Metadata = {
    title: "Event & Conference Chauffeur Melbourne | VIP Transport - ChauffeurTop",
    description: "Professional chauffeur service for conferences, galas, and special events in Melbourne. VIP transport, multiple vehicles available, hourly hire options.",
    keywords: ["event chauffeur melbourne", "conference transport", "vip event transfer", "gala chauffeur service", "corporate event transport"],
    alternates: {
        canonical: "https://chauffeurtop.com.au/services/conference-events",
    },
    openGraph: {
        title: "Event & Conference Chauffeur Melbourne | ChauffeurTop",
        description: "Professional chauffeur service for conferences, galas, and special events.",
        url: "https://chauffeurtop.com.au/services/conference-events",
        type: "website",
    },
};

export default function ConferenceEventsPage() {
    return <ConferenceEventsContent />;
}
