import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
        // Return mock data if env vars are not set
        return NextResponse.json({
            result: {
                reviews: [],
                mock: true
            }
        });
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=en`
        );
        const data = await response.json();

        if (data.status !== 'OK') {
            throw new Error(data.error_message || 'Failed to fetch reviews');
        }

        // Return only the top 5 reviews
        const reviews = data.result.reviews ? data.result.reviews.slice(0, 5) : [];
        return NextResponse.json({ result: { reviews, mock: false } });

    } catch (error) {
        console.error('Google Reviews Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}
