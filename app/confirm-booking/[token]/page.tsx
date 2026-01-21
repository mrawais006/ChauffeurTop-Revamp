'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { CheckCircle2, AlertCircle, Loader2, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

interface Quote {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
}

export default function ConfirmBookingPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const token = params.token as string;
    const success = searchParams.get('success') === 'true';
    const alreadyConfirmed = searchParams.get('already_confirmed') === 'true';

    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        // If we already have the status from URL params (trusted from API), skip fetch
        if (success || alreadyConfirmed) {
            setLoading(false);
            return;
        }

        const fetchQuoteDetails = async () => {
            try {
                // Try to fetch quote by token first (if not yet confirmed)
                let { data, error: fetchError } = await supabase
                    .from('quotes')
                    .select('*')
                    .eq('confirmation_token', token)
                    .single();

                // If not found by token, try to find recently confirmed booking
                if (fetchError || !data) {
                    // Look for confirmed quotes from the last hour
                    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
                    const { data: recentData, error: recentError } = await supabase
                        .from('quotes')
                        .select('*')
                        .eq('status', 'confirmed')
                        .gte('quote_accepted_at', oneHourAgo)
                        .order('quote_accepted_at', { ascending: false })
                        .limit(1)
                        .single();

                    if (recentError || !recentData) {
                        setError('Booking not found. It may have expired or already been processed.');
                        setLoading(false);
                        return;
                    }

                    data = recentData;
                }

                setQuote(data);
            } catch (err) {
                console.error('Error fetching quote:', err);
                setError('Unable to load booking details. Please contact us for assistance.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuoteDetails();
    }, [token, supabase, success, alreadyConfirmed]);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-x-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-luxury-gold/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-br from-luxury-gold/8 to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                    <div className="bg-black/50 backdrop-blur-md py-16 px-8 shadow-2xl sm:rounded-xl border border-luxury-gold/20 text-center">
                        <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-luxury-gold/70 font-serif text-sm">Loading your booking details...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error State - Only show if we don't have a trusted success flag AND we failed to fetch data
    if ((!success && !alreadyConfirmed) && (error || !quote)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-x-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-luxury-gold/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-br from-luxury-gold/8 to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                    <div className="bg-black/50 backdrop-blur-md py-12 px-8 shadow-2xl sm:rounded-xl border border-red-500/30 text-center">
                        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
                        <h1 className="text-2xl font-serif font-bold text-white mb-3">Booking Not Found</h1>
                        <p className="text-gray-400 mb-8 text-sm">{error || 'Unable to access booking details.'}</p>
                        <Link href="/">
                            <button className="w-full bg-luxury-gold text-luxury-black hover:bg-white hover:text-black font-bold uppercase tracking-widest py-4 px-6 rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl text-xs">
                                Return to Homepage
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isAlreadyConfirmed = alreadyConfirmed || quote?.status === 'confirmed' || quote?.status === 'completed';

    // Success State
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-x-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-luxury-gold/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-br from-luxury-gold/8 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-luxury-gold/5 to-transparent rounded-full blur-3xl"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-luxury-gold to-luxury-gold/80 mb-6 shadow-2xl shadow-luxury-gold/30">
                        <CheckCircle2 className="h-12 w-12 text-luxury-black" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-white mb-3">
                        {isAlreadyConfirmed && !success ? 'Link Expired' : 'Booking Confirmed!'}
                    </h1>
                    <div className="w-48 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-4"></div>
                    <p className="text-luxury-gold/70 font-serif text-sm">
                        {isAlreadyConfirmed && !success 
                            ? 'The token expired and you have already booked.'
                            : 'Thank you for confirming your booking with ChauffeurTop!'
                        }
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-black/50 backdrop-blur-md py-10 px-8 shadow-2xl sm:rounded-xl border border-luxury-gold/20">
                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <p className="text-white/90 text-base leading-relaxed">
                            You will receive a confirmation email shortly with all your booking details.
                        </p>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
                        <h3 className="text-luxury-gold font-serif font-bold text-sm uppercase tracking-wider mb-4 text-center">
                            Need Assistance?
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-3">
                                <Phone className="h-4 w-4 text-luxury-gold" />
                                <a 
                                    href="tel:+61430240945" 
                                    className="text-white hover:text-luxury-gold transition-colors text-sm font-medium"
                                >
                                    +61 430 240 945
                                </a>
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <Mail className="h-4 w-4 text-luxury-gold" />
                                <a 
                                    href="mailto:bookings@chauffeurtop.com.au" 
                                    className="text-white hover:text-luxury-gold transition-colors text-sm font-medium"
                                >
                                    bookings@chauffeurtop.com.au
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Return Home Button */}
                    <Link href="/">
                        <button className="w-full bg-luxury-gold text-luxury-black hover:bg-white hover:text-black font-bold uppercase tracking-widest py-4 px-6 rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl text-xs">
                            Return to Homepage
                        </button>
                    </Link>

                    {/* Footer Note */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-white/50 font-serif">
                            ChauffeurTop Melbourne - Premium Chauffeur Services
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
