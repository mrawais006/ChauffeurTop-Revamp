import { ServiceHero } from "@/components/services/ServiceHero";
import ContactForm from "@/components/contact/ContactForm";
import ServiceAreas from "@/components/contact/ServiceAreas";
import ReadyToBook from "@/components/about/ReadyToBook";

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
