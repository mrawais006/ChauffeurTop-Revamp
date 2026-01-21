import type { Metadata } from "next";
import ThankYouContent from "./ThankYouContent";

export const metadata: Metadata = {
  title: "Thank You | ChauffeurTop",
  description: "Thank you for your booking request. We'll be in touch shortly.",
  robots: { index: false, follow: false },
};

export default function LandingThankYouPage() {
  return <ThankYouContent />;
}
