import type { Metadata } from "next";
import { ServiceHero } from "@/components/services/ServiceHero";
import ContactForm from "@/components/contact/ContactForm";
import ServiceAreas from "@/components/contact/ServiceAreas";
import ReadyToBook from "@/components/about/ReadyToBook";

export const metadata: Metadata = {
  title: "Contact ChauffeurTop | 24/7 Melbourne Chauffeur Service",
  description: "Contact Melbourne's premier chauffeur service. Available 24/7 for bookings, inquiries, and corporate account setup. Call 0430 240 945 or submit our contact form.",
  keywords: ["contact chauffeur melbourne", "book chauffeur service", "melbourne car hire contact", "chauffeur booking enquiry"],
  alternates: {
    canonical: "https://chauffeurtop.com.au/contact",
  },
  openGraph: {
    title: "Contact ChauffeurTop | 24/7 Melbourne Chauffeur Service",
    description: "Contact Melbourne's premier chauffeur service. Available 24/7 for bookings and inquiries.",
    url: "https://chauffeurtop.com.au/contact",
    type: "website",
  },
};

export default function ContactPage() {
    return (
        <main>
            <ServiceHero
                title="Contact Us"
                subtitle="24/7 Premium Support"
                description="Our dedicated team is ready to assist you with your luxury travel needs, any time of day or night."
                backgroundImage="/about/about_hero_luxury_melbourne.png"
                backgroundClassName="scale-110"
                overlay={true}
            />
            <ContactForm />
            <ServiceAreas />
            <ReadyToBook />
        </main>
    );
}
