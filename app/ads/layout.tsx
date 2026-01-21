import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout bypasses the main navbar/footer
  // Children (landing pages) will use LandingPageLayout for their own header/footer
  return <>{children}</>;
}
