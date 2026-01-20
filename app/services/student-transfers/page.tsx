import type { Metadata } from "next";
import StudentTransfersContent from "./StudentTransfersContent";

export const metadata: Metadata = {
    title: "International Student Transfers Melbourne | Safe Airport Pickup - ChauffeurTop",
    description: "Safe airport transfers for international students in Melbourne. GPS tracking for parents, vetted drivers, university campus drop-offs. Book your student transfer today.",
    keywords: ["international student transfer", "student airport pickup melbourne", "university transfer service", "student accommodation transfer", "safe student transport"],
    alternates: {
        canonical: "https://chauffeurtop.com.au/services/student-transfers",
    },
    openGraph: {
        title: "International Student Transfers Melbourne | ChauffeurTop",
        description: "Safe airport transfers for international students with GPS tracking and vetted drivers.",
        url: "https://chauffeurtop.com.au/services/student-transfers",
        type: "website",
    },
};

export default function StudentTransfersPage() {
    return <StudentTransfersContent />;
}
