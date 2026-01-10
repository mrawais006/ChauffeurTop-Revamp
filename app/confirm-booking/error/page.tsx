'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmBookingErrorPage() {
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <Card className="p-8 max-w-lg w-full">
                <div className="text-center">
                    <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
                    <p className="text-lg text-gray-600 mb-8">{message}</p>

                    {/* Contact Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold text-blue-900 mb-4">Need Help?</h2>
                        <div className="space-y-3 text-left">
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-600">Call us</p>
                                    <a href="tel:+61412345678" className="text-blue-600 hover:underline font-semibold">
                                        +61 412 345 678
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-600">Email us</p>
                                    <a href="mailto:bookings@chauffertop.com.au" className="text-blue-600 hover:underline font-semibold">
                                        bookings@chauffertop.com.au
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/" className="flex-1">
                            <Button variant="outline" className="w-full">
                                Return to Homepage
                            </Button>
                        </Link>
                        <Link href="/booking" className="flex-1">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                Make New Booking
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}
