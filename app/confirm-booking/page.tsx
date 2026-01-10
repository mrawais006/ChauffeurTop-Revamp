import { redirect } from 'next/navigation';

export default async function ConfirmBookingPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string; type?: string }>;
}) {
    const { token } = await searchParams;

    if (token) {
        // If we have a token query param, redirect to the dynamic route
        // This handles /confirm-booking?token=xyz -> /confirm-booking/xyz
        redirect(`/confirm-booking/${token}`);
    }

    // If no token, redirect to home or show error
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h1>
                <p className="text-gray-600 mb-6">
                    This booking confirmation link appears to be invalid or incomplete.
                </p>
                <a
                    href="/"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Return Home
                </a>
            </div>
        </div>
    );
}
