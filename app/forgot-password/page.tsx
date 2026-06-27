"use client";

import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[var(--black)] flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--gold)]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1
            className="text-4xl md:text-5xl font-bold text-[var(--gold)] mb-3"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            ODM Groove
          </h1>
          <p className="text-[var(--warm-gray)] text-sm tracking-widest uppercase font-semibold">
            Staff Portal
          </p>
        </div>

        <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--gold)]/20 via-[var(--gold)] to-[var(--gold)]/20" />

          <div className="text-center space-y-4 mb-8">
            <div className="w-16 h-16 bg-[var(--gold)]/10 text-[var(--gold)] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--off-white)]">
              Password Reset
            </h2>
            <p className="text-sm text-[var(--warm-gray)] leading-relaxed">
              For security reasons, self-service password resets are disabled for staff accounts.
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mb-8">
            <p className="text-sm text-amber-200/90 leading-relaxed text-center">
              Please contact your <strong>Super Admin</strong> or the IT department. 
              They can generate a new temporary password for you from the Staff Management dashboard.
            </p>
          </div>

          <Link
            href="/admin"
            className="w-full btn-gold py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:-translate-y-0.5 transition-transform"
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
