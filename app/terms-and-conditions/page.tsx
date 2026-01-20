import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms and Conditions | ChauffeurTop',
    description: 'Terms and Conditions for ChauffeurTop - Review our service agreement, booking policies, payment terms, and service standards for luxury chauffeur services in Melbourne.',
    alternates: {
        canonical: 'https://chauffeurtop.com.au/terms-and-conditions',
    },
};

export default function TermsAndConditionsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-luxury-black via-luxury-navy to-luxury-black">
            {/* Hero Section */}
            <div className="relative bg-luxury-navy/50 border-b border-white/10">
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
                        Terms and Conditions
                    </h1>
                    <p className="text-white/70 text-lg max-w-3xl">
                        Please read these terms and conditions carefully before using ChauffeurTop's services. By booking our services, you agree to be bound by these terms.
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
                            Service Agreement
                        </h2>
                        <p className="text-white/80 leading-relaxed">
                            These Terms and Conditions govern the use of ChauffeurTop's services in Melbourne, Australia. By booking our services, you agree to these terms.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="font-serif text-2xl text-luxury-gold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold text-sm font-bold">2</span>
                            Booking and Cancellation
                        </h2>
                        <div className="space-y-4 ml-11">
                            <div>
                                <p className="text-luxury-gold/90 font-semibold mb-2">2.1. Advance Booking</p>
                                <p className="text-white/80 leading-relaxed">
                                    Bookings must be made at least 2 hours in advance for standard services.
                                </p>
                            </div>
                            <div>
                                <p className="text-luxury-gold/90 font-semibold mb-2">2.2. Cancellation Policy</p>
                                <p className="text-white/80 leading-relaxed">
                                    Cancellations made less than 2 hours before the scheduled pickup time may incur a cancellation fee.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="font-serif text-2xl text-luxury-gold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold text-sm font-bold">3</span>
                            Payment Terms
                        </h2>
                        <div className="space-y-4 ml-11">
                            <div>
                                <p className="text-luxury-gold/90 font-semibold mb-2">3.1. Payment Requirements</p>
                                <p className="text-white/80 leading-relaxed">
                                    Payment is required at the time of booking unless otherwise arranged for corporate accounts.
                                </p>
                            </div>
                            <div>
                                <p className="text-luxury-gold/90 font-semibold mb-2">3.2. Pricing</p>
                                <p className="text-white/80 leading-relaxed">
                                    All prices are in Australian Dollars (AUD) and include GST.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="font-serif text-2xl text-luxury-gold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold text-sm font-bold">4</span>
                            Service Standards
                        </h2>
                        <div className="space-y-4 ml-11">
                            <div>
                                <p className="text-luxury-gold/90 font-semibold mb-2">4.1. Service Quality</p>
                                <p className="text-white/80 leading-relaxed">
                                    We strive to provide punctual and professional service at all times.
                                </p>
                            </div>
                            <div>
                                <p className="text-luxury-gold/90 font-semibold mb-2">4.2. Driver Compliance</p>
                                <p className="text-white/80 leading-relaxed">
                                    Our drivers are licensed and comply with all relevant Australian transportation regulations.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="font-serif text-2xl text-luxury-gold mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold text-sm font-bold">5</span>
                            Liability
                        </h2>
                        <div className="space-y-4 ml-11">
                            <div>
                                <p className="text-luxury-gold/90 font-semibold mb-2">5.1. Insurance Coverage</p>
                                <p className="text-white/80 leading-relaxed">
                                    ChauffeurTop maintains comprehensive insurance coverage as required by Australian law.
                                </p>
                            </div>
                            <div>
                                <p className="text-luxury-gold/90 font-semibold mb-2">5.2. Limitations</p>
                                <p className="text-white/80 leading-relaxed">
                                    We are not liable for delays caused by circumstances beyond our control.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section className="pt-6 border-t border-white/10">
                        <h2 className="font-serif text-2xl text-luxury-gold mb-4">
                            Questions About Our Terms?
                        </h2>
                        <p className="text-white/80 leading-relaxed">
                            If you have any questions or concerns about our terms and conditions, please contact us at{' '}
                            <a href="mailto:info@chauffeur-top.com.au" className="text-luxury-gold hover:text-white transition-colors">
                                info@chauffeur-top.com.au
                            </a>
                            {' '}or call us at{' '}
                            <a href="tel:0430240945" className="text-luxury-gold hover:text-white transition-colors">
                                (04) 3024 0945
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
