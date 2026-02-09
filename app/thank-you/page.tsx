import { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Thank You | ChauffeurTop Melbourne',
  description: 'Thank you for contacting ChauffeurTop. We will get back to you shortly.',
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Success Icon with Luxury Gold */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-luxury-gold rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(223,168,116,0.3)]">
            <svg 
              className="w-12 h-12 text-black" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Thank You Message */}
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
          Thank You!
        </h1>
        
        <p className="text-xl text-white/70 mb-2">
          Your quote request has been received successfully.
        </p>
        <p className="text-lg text-luxury-gold mb-8">
          You'll receive a personalised quote within 30 minutes during business hours.
        </p>

        {/* Decorative Line */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-px w-16 bg-luxury-gold/30"></div>
          <div className="w-2 h-2 bg-luxury-gold rounded-full mx-4"></div>
          <div className="h-px w-16 bg-luxury-gold/30"></div>
        </div>

        {/* Why You'll Love ChauffeurTop */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-luxury-gold/20 text-left">
          <p className="text-luxury-gold mb-4 text-sm uppercase tracking-wider font-bold text-center">
            Why You'll Love ChauffeurTop
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-luxury-gold text-lg shrink-0">🚘</span>
              <div>
                <p className="text-white font-semibold text-sm">Luxury Fleet</p>
                <p className="text-white/50 text-xs">Mercedes, BMW, and Audi vehicles — premium comfort on every ride.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-luxury-gold text-lg shrink-0">🔒</span>
              <div>
                <p className="text-white font-semibold text-sm">Fixed Pricing</p>
                <p className="text-white/50 text-xs">No surge, no hidden fees. Your quoted price is final — often comparable to standard taxi fares.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-luxury-gold text-lg shrink-0">🎩</span>
              <div>
                <p className="text-white font-semibold text-sm">Professional Chauffeurs</p>
                <p className="text-white/50 text-xs">Fully licensed, background-checked drivers. Not a random rideshare — a premium, reliable service.</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-white/40 text-xs">Trusted by 10,000+ Melbourne travellers · 4.9/5 on Google</p>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10">
          <p className="text-white/70 mb-4 text-sm uppercase tracking-wider font-bold">
            Need Immediate Assistance?
          </p>
          <div className="space-y-3">
            <a 
              href={`tel:${BUSINESS_CONFIG.PHONE}`}
              className="block text-luxury-gold hover:text-white font-semibold text-lg transition-colors"
            >
              📞 {BUSINESS_CONFIG.PHONE_DISPLAY}
            </a>
            <a 
              href={`mailto:${BUSINESS_CONFIG.EMAIL}`}
              className="block text-luxury-gold hover:text-white font-medium transition-colors"
            >
              ✉️ {BUSINESS_CONFIG.EMAIL}
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-luxury-gold hover:bg-white text-black font-bold py-3 px-8 rounded-sm transition-all duration-300 uppercase tracking-widest text-xs shadow-lg hover:shadow-xl"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-sm transition-all duration-300 backdrop-blur-sm border border-white/10 uppercase tracking-widest text-xs"
          >
            Send Another Message
          </Link>
        </div>
      </div>
    </div>
  );
}

