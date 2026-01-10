'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Loader2, Phone, Mail, MapPin, Calendar, Clock, Users, Car } from 'lucide-react';
import Link from 'next/link';

interface Quote {
    id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    pickup_location: string;
    dropoff_location: string;
    vehicle_name: string;
    passengers: number;
    quoted_price: number;
    status: string;
    price_breakdown?: any;
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

    const supabase = createClientComponentClient();

    useEffect(() => {
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
    }, [token, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
                <Card className="p-8 max-w-md w-full text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your booking details...</p>
                </Card>
            </div>
        );
    }

    if (error || !quote) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
                <Card className="p-8 max-w-md w-full">
                    <div className="text-center">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link href="/">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Return to Homepage
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    const isAlreadyConfirmed = alreadyConfirmed || quote.status === 'confirmed' || quote.status === 'completed';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Success/Already Confirmed Header */}
                <Card className={`p-8 mb-6 ${isAlreadyConfirmed && !success ? 'border-amber-300 bg-amber-50' : 'border-green-300 bg-green-50'}`}>
                    <div className="text-center">
                        <CheckCircle2 className={`h-20 w-20 mx-auto mb-4 ${isAlreadyConfirmed && !success ? 'text-amber-600' : 'text-green-600'}`} />

                        {isAlreadyConfirmed && !success ? (
                            <>
                                <h1 className="text-3xl font-bold text-amber-900 mb-2">
                                    Booking Already Confirmed
                                </h1>
                                <p className="text-lg text-amber-700">
                                    This booking has already been confirmed. No further action is needed.
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold text-green-900 mb-2">
                                    Booking Confirmed! 🎉
                                </h1>
                                <p className="text-lg text-green-700">
                                    Thank you for confirming your booking with ChauffeurTop!
                                </p>
                            </>
                        )}
                    </div>
                </Card>

                {/* Booking Details */}
                <Card className="p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Car className="h-6 w-6 text-blue-600" />
                        Your Booking Details
                    </h2>

                    <div className="space-y-4">
                        {/* Customer Info */}
                        <div className="grid md:grid-cols-2 gap-4 pb-4 border-b">
                            <div className="flex items-start gap-3">
                                <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Passenger Name</p>
                                    <p className="font-semibold text-gray-900">{quote.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-semibold text-gray-900">{quote.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 md:col-span-2">
                                <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-900">{quote.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Trip Details */}
                        <div className="grid md:grid-cols-2 gap-4 pb-4 border-b">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(quote.date).toLocaleDateString('en-AU', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Pickup Time</p>
                                    <p className="font-semibold text-gray-900">{quote.time}</p>
                                </div>
                            </div>
                        </div>

                        {/* Locations */}
                        <div className="space-y-3 pb-4 border-b">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Pickup Location</p>
                                    <p className="font-semibold text-gray-900">{quote.pickup_location}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Dropoff Location</p>
                                    <p className="font-semibold text-gray-900">{quote.dropoff_location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle & Passengers */}
                        <div className="grid md:grid-cols-2 gap-4 pb-4 border-b">
                            <div className="flex items-start gap-3">
                                <Car className="h-5 w-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Vehicle</p>
                                    <p className="font-semibold text-gray-900">{quote.vehicle_name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Passengers</p>
                                    <p className="font-semibold text-gray-900">{quote.passengers}</p>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border-2 border-amber-300">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-900">Total Amount</span>
                                <span className="text-3xl font-bold text-amber-700">
                                    ${quote.quoted_price?.toFixed(2) || '0.00'}
                                </span>
                            </div>
                            {quote.price_breakdown?.discount && (
                                <p className="text-sm text-green-700 mt-2">
                                    ✓ Discount applied: {quote.price_breakdown.discount.reason}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Next Steps */}
                <Card className="p-8 mb-6 bg-blue-50 border-blue-200">
                    <h2 className="text-xl font-bold text-blue-900 mb-4">What Happens Next?</h2>
                    <ul className="space-y-3 text-blue-800">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>You will receive a confirmation email shortly with all booking details</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Our team will contact you 24 hours before your pickup time to confirm</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Your chauffeur will arrive 10 minutes before the scheduled pickup time</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Payment can be made after the service via bank transfer or cash</span>
                        </li>
                    </ul>
                </Card>

                {/* Contact Information */}
                <Card className="p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Need to Make Changes?</h2>
                    <p className="text-gray-600 mb-4">
                        If you need to modify or cancel your booking, please contact us:
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-blue-600" />
                            <a href="tel:+61412345678" className="text-blue-600 hover:underline font-semibold">
                                +61 412 345 678
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-blue-600" />
                            <a href="mailto:bookings@chauffertop.com.au" className="text-blue-600 hover:underline font-semibold">
                                bookings@chauffertop.com.au
                            </a>
                        </div>
                    </div>
                </Card>

                {/* Return Home Button */}
                <div className="text-center mt-8">
                    <Link href="/">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                            Return to Homepage
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
