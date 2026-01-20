import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | ChauffeurTop',
    description: 'Privacy Policy for ChauffeurTop - Learn how we collect, use, and protect your personal information in accordance with Australian Privacy Principles.',
    alternates: {
        canonical: 'https://chauffeurtop.com.au/privacy-policy',
    },
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-luxury-black via-luxury-navy to-luxury-black">
            {/* Hero Section */}
            <div className="relative bg-luxury-navy/50 border-b border-white/10">
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-white/70 text-lg max-w-3xl">
                        Your privacy is important to us. This policy outlines how ChauffeurTop collects, uses, and protects your personal information.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 md:p-12 space-y-8">

                    {/* Section 1 */}
                    <section>
                        <h2 className="font-serif text-2xl text-luxury-gold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold text-sm font-bold">1</span>
                            Information Collection
                        </h2>
                        <p className="text-white/80 leading-relaxed">
                            We collect personal information in accordance with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth).
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="font-serif text-2xl text-luxury-gold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold text-sm font-bold">2</span>
                            Types of Information Collected
                        </h2>
                        <p className="text-white/80 leading-relaxed mb-4">
                            We collect the following types of personal information:
                        </p>
                        <ul className="space-y-2 ml-11">
                            <li className="text-white/80 flex items-start gap-3">
                                <span className="text-luxury-gold mt-1">•</span>
                                <span>Name and contact details</span>
                            </li>
                            <li className="text-white/80 flex items-start gap-3">
                                <span className="text-luxury-gold mt-1">•</span>
                                <span>Booking information and travel preferences</span>
                            </li>
                            <li className="text-white/80 flex items-start gap-3">
                                <span className="text-luxury-gold mt-1">•</span>
                                <span>Payment information</span>
                            </li>
                            <li className="text-white/80 flex items-start gap-3">
                                <span className="text-luxury-gold mt-1">•</span>
                                <span>Communication records</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="font-serif text-2xl text-luxury-gold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold text-sm font-bold">3</span>
                            Use of Information
                        </h2>
                        <p className="text-white/80 leading-relaxed mb-4">
                            Your information is used to:
                        </p>
                        <ul className="space-y-2 ml-11">
                            <li className="text-white/80 flex items-start gap-3">
                                <span className="text-luxury-gold mt-1">•</span>
                                <span>Process your bookings</span>
                            </li>
                            <li className="text-white/80 flex items-start gap-3">
                                <span className="text-luxury-gold mt-1">•</span>
                                <span>Communicate about our services</span>
                            </li>
                            <li className="text-white/80 flex items-start gap-3">
                                <span className="text-luxury-gold mt-1">•</span>
                                <span>Improve our service quality</span>
                            </li>
                            <li className="text-white/80 flex items-start gap-3">
                                <span className="text-luxury-gold mt-1">•</span>
                                <span>Comply with legal obligations</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="font-serif text-2xl text-luxury-gold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold text-sm font-bold">4</span>
                            Data Security
                        </h2>
                        <p className="text-white/80 leading-relaxed">
                            We implement appropriate security measures to protect your personal information from unauthorized access, modification, or disclosure.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="font-serif text-2xl text-luxury-gold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold text-sm font-bold">5</span>
                            Your Rights
                        </h2>
                        <p className="text-white/80 leading-relaxed mb-4">
                            Under Australian privacy law, you have the right to:
                        </p>
                        <ul className="space-y-2 ml-11">
                            <li className="text-white/80 flex items-start gap-3">
                                <span className="text-luxury-gold mt-1">•</span>
                                <span>Access your personal information</span>
                            </li>
                            <li className="text-white/80 flex items-start gap-3">
                                <span className="text-luxury-gold mt-1">•</span>
                                <span>Request corrections to your information</span>
                            </li>
                            <li className="text-white/80 flex items-start gap-3">
                                <span className="text-luxury-gold mt-1">•</span>
                                <span>Make complaints about privacy breaches</span>
                            </li>
                        </ul>
                    </section>

                    {/* Contact Section */}
                    <section className="pt-6 border-t border-white/10">
                        <h2 className="font-serif text-2xl text-luxury-gold mb-4">
                            Contact Us
                        </h2>
                        <p className="text-white/80 leading-relaxed">
                            If you have any questions or concerns about our privacy policy or how we handle your personal information, please contact us at{' '}
                            <a href="mailto:info@chauffeur-top.com.au" className="text-luxury-gold hover:text-white transition-colors">
                                info@chauffeur-top.com.au
                            </a>
                        </p>
                    </section>

                    {/* Last Updated */}
                    <div className="pt-6 border-t border-white/10">
                        <p className="text-white/50 text-sm">
                            Last updated: January 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
