import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BUSINESS_INFO, SITE_URL } from "../lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service and booking policies for ODM Groove Hotel & Event Hall (ODM Groove Limited) in Ijoko Ogbayo, Ogun State, Nigeria.",
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--black)] text-[var(--off-white)]">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="font-display text-3xl md:text-5xl font-bold mb-6">
          Terms of <span className="gradient-text italic">Service</span>
        </h1>
        <p className="text-[var(--warm-gray)] text-sm mb-10">
          Last updated: {new Date().getFullYear()} · {BUSINESS_INFO.legalName} ({BUSINESS_INFO.rcNumber})
        </p>

        <div className="space-y-8 text-[var(--warm-gray)] leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--off-white)] mb-3">
              1. Room Reservations &amp; Check-In / Check-Out
            </h2>
            <p>
              Standard check-in time is from 2:00 PM and check-out time is 12:00 PM (Noon). Early check-in or late check-out may be arranged subject to room availability. All room rates are quoted in Nigerian Naira (NGN) and include complimentary daily breakfast and WiFi.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--off-white)] mb-3">
              2. Event Hall Bookings
            </h2>
            <p>
              Event hall reservations are confirmed upon agreement with our events team and payment of the required deposit. Guests and event organizers are responsible for adhering to venue capacity and safety guidelines.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--off-white)] mb-3">
              3. Contact Information
            </h2>
            <p>
              For booking modifications, cancellations, or questions regarding these terms, please contact {BUSINESS_INFO.name} at{" "}
              <a href={`mailto:${BUSINESS_INFO.email}`} className="text-[var(--gold)] hover:underline">
                {BUSINESS_INFO.email}
              </a>{" "}
              or{" "}
              <a href={`tel:${BUSINESS_INFO.phone}`} className="text-[var(--gold)] hover:underline">
                {BUSINESS_INFO.phoneDisplay}
              </a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

