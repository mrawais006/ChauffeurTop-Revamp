'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, Phone, Mail, MapPin, Calendar, Clock, Car, Users } from 'lucide-react';
import Link from 'next/link';

interface QuoteData {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    pickup_location: string;
    dropoff_location?: string;
    destinations?: any;
    date: string;
    time: string;
    vehicle_name?: string;
    vehicle_type?: string;
    passengers: number;
    quoted_price: number;
    confirmation_token?: string;
}

type PageState = 'loading' | 'review' | 'confirming' | 'success' | 'already_confirmed' | 'error';

export default function ConfirmBookingPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const token = params.token as string;
    const successParam = searchParams.get('success') === 'true';
    const alreadyConfirmedParam = searchParams.get('already_confirmed') === 'true';

    const [quote, setQuote] = useState<QuoteData | null>(null);
    const [pageState, setPageState] = useState<PageState>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        // If redirected from old GET flow with success flag
        if (successParam) {
            setPageState('success');
            return;
        }
        if (alreadyConfirmedParam) {
            setPageState('already_confirmed');
            return;
        }

        const fetchQuoteDetails = async () => {
            try {
                // Fetch via server API to bypass RLS
                const response = await fetch(`/api/confirm-booking/details?token=${token}`);
                const result = await response.json();

                if (!response.ok || !result.quote) {
                    setErrorMessage('Booking not found. This link may have expired or is invalid.');
                    setPageState('error');
                    return;
                }

                const data = result.quote;
                setQuote(data);

                // If already confirmed, show the success state
                if (data.status === 'confirmed' || data.status === 'completed') {
                    setPageState('already_confirmed');
                } else {
                    // Show the review + confirm button
                    setPageState('review');
                }
            } catch (err) {
                console.error('Error fetching quote:', err);
                setErrorMessage('Unable to load booking details. Please contact us for assistance.');
                setPageState('error');
            }
        };

        fetchQuoteDetails();
    }, [token, successParam, alreadyConfirmedParam]);

    // Handle the actual confirmation via POST
    const handleConfirm = async () => {
        setPageState('confirming');

        try {
            const response = await fetch('/api/confirm-booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to confirm booking');
            }

            if (result.already_confirmed) {
                setPageState('already_confirmed');
            } else {
                setPageState('success');
            }
        } catch (err: any) {
            console.error('Confirmation error:', err);
            setErrorMessage(err.message || 'Failed to confirm booking. Please try again or contact us.');
            setPageState('error');
        }
    };

    // Format destination from quote data
    const getDestination = () => {
        if (!quote) return 'N/A';
        if (Array.isArray(quote.destinations) && quote.destinations.length > 0) {
            return quote.destinations[0];
        }
        if (quote.dropoff_location) return quote.dropoff_location;
        if (quote.destinations && typeof quote.destinations === 'object') {
            const dests = quote.destinations as any;
            if (dests.outbound?.destinations?.[0]) return dests.outbound.destinations[0];
        }
        return 'As instructed';
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-AU', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    // ===== LOADING =====
    if (pageState === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-x-hidden">
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

    // ===== ERROR =====
    if (pageState === 'error') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-x-hidden">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-luxury-gold/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-br from-luxury-gold/8 to-transparent rounded-full blur-3xl"></div>
                </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                    <div className="bg-black/50 backdrop-blur-md py-12 px-8 shadow-2xl sm:rounded-xl border border-red-500/30 text-center">
                        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
                        <h1 className="text-2xl font-serif font-bold text-white mb-3">Something Went Wrong</h1>
                        <p className="text-gray-400 mb-8 text-sm">{errorMessage}</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => { setPageState('loading'); window.location.reload(); }}
                                className="w-full bg-luxury-gold text-luxury-black hover:bg-white hover:text-black font-bold uppercase tracking-widest py-4 px-6 rounded-sm transition-all duration-300 shadow-lg text-xs"
                            >
                                Try Again
                            </button>
                            <Link href="/">
                                <button className="w-full bg-transparent border border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-widest py-4 px-6 rounded-sm transition-all duration-300 text-xs mt-2">
                                    Return to Homepage
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ===== CONFIRMING (spinner while POST is in-flight) =====
    if (pageState === 'confirming') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-x-hidden">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-luxury-gold/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-br from-luxury-gold/8 to-transparent rounded-full blur-3xl"></div>
                </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                    <div className="bg-black/50 backdrop-blur-md py-16 px-8 shadow-2xl sm:rounded-xl border border-luxury-gold/20 text-center">
                        <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-luxury-gold font-serif text-lg font-bold mb-2">Confirming Your Booking...</p>
                        <p className="text-white/50 text-sm">Please wait while we process your confirmation.</p>
                    </div>
                </div>
            </div>
        );
    }

    // ===== REVIEW (show details + confirm button) =====
    if (pageState === 'review' && quote) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-x-hidden">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-luxury-gold/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-br from-luxury-gold/8 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-luxury-gold/5 to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
                            Confirm Your Booking
                        </h1>
                        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-4"></div>
                        <p className="text-luxury-gold/70 font-serif text-sm">
                            Please review your booking details and confirm below.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-black/50 backdrop-blur-md py-8 px-6 sm:px-8 shadow-2xl sm:rounded-xl border border-luxury-gold/20">
                        {/* Price Highlight */}
                        <div className="text-center mb-6 p-4 bg-gradient-to-r from-luxury-gold/10 via-luxury-gold/20 to-luxury-gold/10 rounded-lg border border-luxury-gold/30">
                            <p className="text-luxury-gold/60 text-xs uppercase tracking-widest mb-1">Quoted Price</p>
                            <p className="text-4xl font-bold text-luxury-gold">
                                ${(quote.quoted_price || 0).toFixed(2)}
                            </p>
                        </div>

                        {/* Trip Details */}
                        <div className="space-y-4 mb-8">
                            <h2 className="text-luxury-gold font-serif font-bold text-sm uppercase tracking-wider">
                                Trip Details
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-4 w-4 text-luxury-gold mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-white/40 text-xs uppercase">Date</p>
                                        <p className="text-white text-sm font-medium">{formatDate(quote.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="h-4 w-4 text-luxury-gold mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-white/40 text-xs uppercase">Time</p>
                                        <p className="text-white text-sm font-medium">{quote.time}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-luxury-gold mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-white/40 text-xs uppercase">Pickup</p>
                                        <p className="text-white text-sm font-medium">{quote.pickup_location}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-white/40 text-xs uppercase">Destination</p>
                                        <p className="text-white text-sm font-medium">{getDestination()}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Car className="h-4 w-4 text-luxury-gold mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-white/40 text-xs uppercase">Vehicle</p>
                                        <p className="text-white text-sm font-medium">{quote.vehicle_name || quote.vehicle_type || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Users className="h-4 w-4 text-luxury-gold mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-white/40 text-xs uppercase">Passengers</p>
                                        <p className="text-white text-sm font-medium">{quote.passengers}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirm}
                            className="w-full bg-luxury-gold text-luxury-black hover:bg-white hover:text-black font-bold uppercase tracking-widest py-5 px-6 rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl text-sm mb-4"
                        >
                            ✓ Confirm Booking
                        </button>

                        <p className="text-center text-white/40 text-xs">
                            By confirming, you agree to the quoted price and our service terms. Our team will be in touch to arrange payment.
                        </p>

                        {/* Contact */}
                        <div className="mt-6 pt-6 border-t border-white/10 text-center">
                            <p className="text-white/40 text-xs mb-2">Need to discuss? Contact us:</p>
                            <div className="flex items-center justify-center gap-4">
                                <a href="tel:+61430240945" className="text-luxury-gold text-sm hover:text-white transition-colors">
                                    +61 430 240 945
                                </a>
                                <span className="text-white/20">|</span>
                                <a href="mailto:bookings@chauffeurtop.com.au" className="text-luxury-gold text-sm hover:text-white transition-colors">
                                    Email Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ===== SUCCESS or ALREADY CONFIRMED =====
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-x-hidden">
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
                        {pageState === 'already_confirmed' ? 'Already Confirmed' : 'Booking Confirmed!'}
                    </h1>
                    <div className="w-48 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto mb-4"></div>
                    <p className="text-luxury-gold/70 font-serif text-sm">
                        {pageState === 'already_confirmed'
                            ? 'This booking has already been confirmed. You should have received a confirmation email with your details.'
                            : 'Thank you for confirming your booking with ChauffeurTop! Our team will be in touch to finalise payment and details.'
                        }
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-black/50 backdrop-blur-md py-10 px-8 shadow-2xl sm:rounded-xl border border-luxury-gold/20">
                    <div className="text-center mb-8">
                        <p className="text-white/90 text-base leading-relaxed">
                            {pageState === 'success'
                                ? 'You will receive a confirmation email shortly with your booking details and the total payable amount. Our team will contact you to arrange payment before your trip.'
                                : 'If you need any changes, please contact us directly.'
                            }
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
                                <a href="tel:+61430240945" className="text-white hover:text-luxury-gold transition-colors text-sm font-medium">
                                    +61 430 240 945
                                </a>
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <Mail className="h-4 w-4 text-luxury-gold" />
                                <a href="mailto:bookings@chauffeurtop.com.au" className="text-white hover:text-luxury-gold transition-colors text-sm font-medium">
                                    bookings@chauffeurtop.com.au
                                </a>
                            </div>
                        </div>
                    </div>

                    <Link href="/">
                        <button className="w-full bg-luxury-gold text-luxury-black hover:bg-white hover:text-black font-bold uppercase tracking-widest py-4 px-6 rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl text-xs">
                            Return to Homepage
                        </button>
                    </Link>

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
