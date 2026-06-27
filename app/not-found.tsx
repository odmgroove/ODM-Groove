import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--dark)] flex flex-col items-center justify-center p-6 text-center">
      {/* 404 Graphic */}
      <h1
        className="text-[120px] sm:text-[180px] font-black text-[var(--gold)]/20 leading-none select-none"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        404
      </h1>

      <div className="-mt-10 sm:-mt-16 relative z-10 space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--off-white)]">
          Page Not Found
        </h2>
        <p className="text-[var(--warm-gray)] max-w-md mx-auto text-sm sm:text-base">
          We can&apos;t seem to find the page you&apos;re looking for. It might have been removed, renamed, or didn&apos;t exist in the first place.
        </p>

        <div className="pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[var(--gold)] hover:bg-[var(--gold)]/90 text-black px-6 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={18} />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
