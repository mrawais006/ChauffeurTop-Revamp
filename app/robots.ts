import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://chauffeurtop.com.au';

  return {
    rules: [
      // Google Ads Bot - MUST be explicitly allowed for ad landing pages
      // AdsBot-Google checks ad destination pages for policy compliance
      {
        userAgent: 'AdsBot-Google',
        allow: ['/ads/', '/'],
        disallow: ['/admin/', '/api/'],
      },
      // AdsBot-Google-Mobile - checks mobile ad destinations (Android/iOS)
      // This is the bot returning 404 errors for your Google Ads
      {
        userAgent: 'AdsBot-Google-Mobile',
        allow: ['/ads/', '/'],
        disallow: ['/admin/', '/api/'],
      },
      // AdsBot-Google-Mobile-Apps - for in-app ad destinations
      {
        userAgent: 'AdsBot-Google-Mobile-Apps',
        allow: ['/ads/', '/'],
        disallow: ['/admin/', '/api/'],
      },
      // Main Googlebot crawler
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/login',
          '/confirm-booking/',
          '/api/',
          '/blogs/preview/',
        ],
      },
      // Googlebot Mobile (smartphone crawler)
      {
        userAgent: 'Googlebot-Mobile',
        allow: '/',
        disallow: [
          '/admin/',
          '/login',
          '/confirm-booking/',
          '/api/',
          '/blogs/preview/',
        ],
      },
      // All other crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/login',
          '/confirm-booking/',
          '/api/',
          '/blogs/preview/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
