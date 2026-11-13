import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BUSINESS_INFO, SITE_URL } from "../lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for ODM Groove Hotel & Event Hall (ODM Groove Limited) in Ijoko Ogbayo, Ogun State, Nigeria.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--black)] text-[var(--off-white)]">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="font-display text-3xl md:text-5xl font-bold mb-6">
          Privacy <span className="gradient-text italic">Policy</span>
        </h1>
        <p className="text-[var(--warm-gray)] text-sm mb-10">
          Last updated: {new Date().getFullYear()} · {BUSINESS_INFO.legalName} ({BUSINESS_INFO.rcNumber})
        </p>

        <div className="space-y-8 text-[var(--warm-gray)] leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--off-white)] mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you book a room, submit an event hall enquiry, place a menu order, or subscribe to event updates at {BUSINESS_INFO.name}, we may collect your name, phone number, email address, booking dates, and any special requests you provide.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--off-white)] mb-3">
              2. How We Use Your Information
            </h2>
            <p>
              We use your information strictly to process room and event hall reservations, fulfill food and drink orders, respond to customer enquiries, and send event notifications if you opt in. We do not sell or rent your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--off-white)] mb-3">
              3. Data Security &amp; Contact
            </h2>
            <p>
              If you would like to update or delete your contact details from our records, please contact us at{" "}
              <a href={`mailto:${BUSINESS_INFO.email}`} className="text-[var(--gold)] hover:underline">
                {BUSINESS_INFO.email}
              </a>{" "}
              or call{" "}
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

