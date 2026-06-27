"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      // Success, navigate to admin dashboard
      window.location.href = "/admin";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--black)] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[var(--dark-card)] border border-[var(--dark-border)] flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-[var(--gold)]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--off-white)] mb-1" style={{ fontFamily: "Playfair Display, serif" }}>
            Admin Panel
          </h1>
          <p className="text-[var(--warm-gray)] text-sm">ODM Groove</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-6 space-y-4 shadow-2xl">
          <div>
            <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-3 text-[var(--off-white)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
              required
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-[var(--gold)] hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-3 pr-10 text-[var(--off-white)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle size={12} /> {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all
              ${loading ? "bg-[var(--dark-border)] text-[var(--warm-gray)] cursor-not-allowed" : "btn-gold"}
            `}
          >
            {loading ? "Authenticating..." : "Enter Dashboard"}
          </button>
        </form>
        <p className="text-center text-[var(--text-muted)] text-xs mt-6">
          <Link href="/" className="hover:text-[var(--warm-gray)] transition-colors flex items-center justify-center gap-2">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
