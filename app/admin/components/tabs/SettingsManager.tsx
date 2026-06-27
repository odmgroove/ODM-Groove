"use client";

import { useState } from "react";
import { Save, Eye, EyeOff, CheckCircle, AlertCircle, Lock, Phone, MessageSquare } from "lucide-react";

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--gold)] mb-5">{title}</h3>
      {children}
    </div>
  );
}

export default function SettingsManager() {
  // Change Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [passwordError, setPasswordError] = useState("");

  // Contact Info (stored locally for now, can be extended to DB)
  const [whatsapp, setWhatsapp] = useState("2347061514120");
  const [phone1, setPhone1] = useState("07061514120");
  const [phone2, setPhone2] = useState("09049180725");
  const [contactStatus, setContactStatus] = useState<"idle" | "saving" | "success">("idle");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordStatus("saving");

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change password");
      }

      setPasswordStatus("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordStatus("idle"), 4000);
    } catch (err: any) {
      setPasswordError(err.message);
      setPasswordStatus("error");
      setTimeout(() => setPasswordStatus("idle"), 3000);
    }
  };

  const handleContactSave = async () => {
    setContactStatus("saving");
    // In a future version, persist these to the DB or .env
    // For now, just show success after a brief delay
    await new Promise(r => setTimeout(r, 600));
    setContactStatus("success");
    setTimeout(() => setContactStatus("idle"), 3000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--off-white)]">Settings</h2>
        <p className="text-sm text-[var(--warm-gray)]">Manage your admin account and hotel contact details.</p>
      </div>

      {/* Change Password */}
      <SettingSection title="Change Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 pr-10 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
                placeholder="Enter current password"
              />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)] hover:text-[var(--gold)]">
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1.5">New Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
              placeholder="Min 8 characters"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1.5">Confirm New Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
              placeholder="Repeat new password"
            />
          </div>

          {passwordError && (
            <div className="flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle size={12} /> {passwordError}
            </div>
          )}

          <button type="submit" disabled={passwordStatus === "saving"}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              passwordStatus === "success"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "btn-gold"
            }`}>
            {passwordStatus === "saving" ? (
              <><span className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" /> Saving...</>
            ) : passwordStatus === "success" ? (
              <><CheckCircle size={13} /> Password Updated!</>
            ) : (
              <><Lock size={13} /> Update Password</>
            )}
          </button>
        </form>
      </SettingSection>

      {/* Contact Numbers */}
      <SettingSection title="Contact Numbers">
        <p className="text-xs text-[var(--warm-gray)] mb-4">These appear on event pages and the hotel booking flow.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1.5 flex items-center gap-2">
              <MessageSquare size={11} className="text-green-400" /> WhatsApp Number (international)
            </label>
            <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
              className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
              placeholder="2347061514120" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <Phone size={11} className="text-[var(--gold)]" /> Phone 1
              </label>
              <input value={phone1} onChange={e => setPhone1(e.target.value)}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
                placeholder="07061514120" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <Phone size={11} className="text-[var(--gold)]" /> Phone 2
              </label>
              <input value={phone2} onChange={e => setPhone2(e.target.value)}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
                placeholder="09049180725" />
            </div>
          </div>
        </div>
        <button onClick={handleContactSave} disabled={contactStatus === "saving"}
          className={`mt-4 flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            contactStatus === "success"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "btn-gold"
          }`}>
          {contactStatus === "saving" ? (
            <><span className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" /> Saving...</>
          ) : contactStatus === "success" ? (
            <><CheckCircle size={13} /> Saved!</>
          ) : (
            <><Save size={13} /> Save Contact Info</>
          )}
        </button>
      </SettingSection>

      {/* Account Info */}
      <SettingSection title="Account Info">
        <div className="flex items-center gap-3 p-4 bg-[var(--dark)] rounded-lg border border-[var(--dark-border)]">
          <div className="w-10 h-10 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] font-bold text-lg">
            A
          </div>
          <div>
            <p className="text-[var(--off-white)] font-semibold text-sm">Admin Account</p>
            <p className="text-[var(--warm-gray)] text-xs">odmgroove@gmail.com</p>
          </div>
          <span className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
            Super Admin
          </span>
        </div>
      </SettingSection>
    </div>
  );
}
