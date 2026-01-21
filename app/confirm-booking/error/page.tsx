'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

function ErrorContent() {
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason') || 'unknown';

    const getErrorMessage = () => {
        switch (reason) {
            case 'missing_token':
                return {
                    title: 'Invalid Confirmation Link',
                    message: 'The confirmation link appears to be incomplete. Please use the link from your email or contact us for assistance.'
                };
            case 'invalid_token':
                return {
                    title: 'Booking Not Found',
                    message: 'This confirmation link is invalid or has expired. Please check your email for the correct link or contact us for help.'
                };
            case 'update_failed':
                return {
                    title: 'Confirmation Failed',
                    message: 'We encountered an issue while confirming your booking. Please try again or contact us directly.'
                };
            case 'server_error':
                return {
                    title: 'Technical Issue',
                    message: 'We experienced a technical problem. Please try again in a few moments or contact us for assistance.'
                };
            default:
                return {
                    title: 'Something Went Wrong',
                    message: 'We encountered an unexpected issue. Please contact us for assistance with your booking.'
                };
        }
    };

    const { title, message } = getErrorMessage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-x-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-luxury-gold/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-br from-luxury-gold/8 to-transparent rounded-full blur-3xl"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-black/50 backdrop-blur-md py-12 px-8 shadow-2xl sm:rounded-xl border border-red-500/30 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6 border border-red-500/20">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    
                    <h1 className="text-2xl font-serif font-bold text-white mb-3">
                        {title}
                    </h1>
                    
                    <p className="text-white/60 mb-8 text-sm leading-relaxed">
                        {message}
                    </p>

                    {/* Contact Information */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8 text-left">
                        <h2 className="text-luxury-gold font-serif font-bold text-xs uppercase tracking-wider mb-4 text-center">
                            Need Assistance?
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-full">
                                    <Phone className="h-4 w-4 text-luxury-gold" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wide mb-0.5">Call us</p>
                                    <a href="tel:+61430240945" className="text-white hover:text-luxury-gold transition-colors text-sm font-medium">
                                        +61 430 240 945
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-full">
                                    <Mail className="h-4 w-4 text-luxury-gold" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wide mb-0.5">Email us</p>
                                    <a href="mailto:bookings@chauffeurtop.com.au" className="text-white hover:text-luxury-gold transition-colors text-sm font-medium">
                                        bookings@chauffeurtop.com.au
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link href="/">
                            <button className="w-full bg-luxury-gold text-luxury-black hover:bg-white hover:text-black font-bold uppercase tracking-widest py-4 px-6 rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl text-xs">
                                Return to Homepage
                            </button>
                        </Link>
                        <Link href="/booking">
                            <button className="w-full bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40 font-bold uppercase tracking-widest py-4 px-6 rounded-sm transition-all duration-300 text-xs">
                                Make New Booking
                            </button>
                        </Link>
                    </div>
                </div>
                
                {/* Footer Note */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-white/30 font-serif">
                        ChauffeurTop Melbourne - Premium Chauffeur Services
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ConfirmBookingErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-luxury-gold text-sm animate-pulse font-serif">Loading...</div>
            </div>
        }>
            <ErrorContent />
        </Suspense>
    );
}
