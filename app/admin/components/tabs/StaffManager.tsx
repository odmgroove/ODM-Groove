"use client";

import { useState, useEffect } from "react";
import {
  Plus, Trash2, Edit2, Save, X, Shield, ShieldCheck, ShieldAlert,
  KeyRound, Users, Eye, EyeOff, Copy
} from "lucide-react";
import ConfirmModal from "../ConfirmModal";
import AlertModal from "../AlertModal";


type Staff = {
  id: string;
  name: string | null;
  email: string;
  isSuperAdmin: boolean;
  permissions: string | null;
  createdAt: string;
  _count?: { ordersHandled: number };
};

const ALL_PERMISSIONS: { key: string; label: string; group: string }[] = [
  { key: "view:kitchen",    label: "View Kitchen Board",    group: "Orders" },
  { key: "view:bar",        label: "View Bar Board",        group: "Orders" },
  { key: "create:orders",   label: "Create Walk-in Orders", group: "Orders" },
  { key: "view:shifts",     label: "View & Manage Shifts",  group: "Orders" },
  { key: "manage:inventory",label: "Manage Inventory",      group: "Inventory" },
  { key: "view:analytics",  label: "View Analytics",        group: "Reports" },
  { key: "view:bookings",   label: "View Bookings",         group: "Admin" },
  { key: "manage:rooms",    label: "Manage Rooms",          group: "Admin" },
  { key: "manage:events",   label: "Manage Events",         group: "Admin" },
  { key: "manage:blog",     label: "Manage Blog",           group: "Admin" },
  { key: "manage:gallery",  label: "Manage Gallery",        group: "Admin" },
  { key: "manage:faqs",     label: "Manage FAQs",           group: "Admin" },
  { key: "manage:ai",       label: "Manage AI Chatbot",     group: "Admin" },
  { key: "manage:staff",    label: "Manage Staff (Admin)",  group: "Admin" },
];

const GROUPS = ["Orders", "Inventory", "Reports", "Admin"];

export default function StaffManager({ currentUserEmail }: { currentUserEmail?: string }) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Staff | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [resetResult, setResetResult] = useState<{ name: string; pass: string } | null>(null);

  // New staff form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPerms, setNewPerms] = useState<string[]>([]);

  // Edit perms
  const [editPerms, setEditPerms] = useState<string[]>([]);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-dismiss success toast after 3s
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const fetchStaff = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/staff");
    if (res.ok) setStaff(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchStaff(); }, []);

  const togglePerm = (perms: string[], key: string): string[] =>
    perms.includes(key) ? perms.filter(p => p !== key) : [...perms, key];

  const handleCreate = async () => {
    if (!newEmail.trim() || !newPassword.trim()) {
      setAlertMessage("Email and password are required.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, email: newEmail, password: newPassword, permissions: newPerms }),
    });
    if (res.ok) {
      setIsAdding(false);
      setNewName(""); setNewEmail(""); setNewPassword(""); setNewPerms([]);
      await fetchStaff();
      setSuccessMessage("Staff account created successfully. Temporary password generated.");
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchStaff();
    } else {
      const err = await res.json();
      setAlertMessage(err.error || "Failed to create staff.");
    }
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setSaving(true);
    const res = await fetch(`/api/admin/staff/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editing.name, permissions: editPerms }),
    });
    
    if (res.ok) {
      setEditing(null);
      await fetchStaff();
      setSuccessMessage("Staff details updated successfully.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      const err = await res.json();
      setAlertMessage(err.error || "Failed to update staff.");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const res = await fetch(`/api/admin/staff/${confirmDelete.id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      setAlertMessage(err.error || "Failed to delete.");
    } else {
      setSuccessMessage("Staff account deleted.");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    setConfirmDelete(null);
    await fetchStaff();
  };

  const handleForceReset = async (s: Staff) => {
    const res = await fetch(`/api/admin/staff/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "force-reset" }),
    });
    if (res.ok) {
      const data = await res.json();
      setResetResult({ name: s.name || s.email, pass: data.tempPassword });
    } else {
      const err = await res.json();
      setAlertMessage(err.error);
    }
  };

  const PermissionGrid = ({ selected, onChange }: { selected: string[]; onChange: (p: string[]) => void }) => (
    <div className="space-y-3">
      {GROUPS.map(group => {
        const groupPerms = ALL_PERMISSIONS.filter(p => p.group === group);
        const allSelected = groupPerms.every(p => selected.includes(p.key));
        return (
          <div key={group}>
            <div className="flex items-center gap-2 mb-1.5">
              <button
                type="button"
                onClick={() => {
                  const keys = groupPerms.map(p => p.key);
                  onChange(allSelected ? selected.filter(s => !keys.includes(s)) : [...new Set([...selected, ...keys])]);
                }}
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border transition-all
                  ${allSelected ? "bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)]/40" : "text-[var(--warm-gray)] border-[var(--dark-border)] hover:border-[var(--gold)]/30"}`}>
                {group}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {groupPerms.map(perm => (
                <label key={perm.key} className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0
                    ${selected.includes(perm.key) ? "bg-[var(--gold)] border-[var(--gold)]" : "border-[var(--dark-border)] group-hover:border-[var(--gold)]/50"}`}
                    onClick={() => onChange(togglePerm(selected, perm.key))}>
                    {selected.includes(perm.key) && <div className="w-2 h-2 bg-black rounded-sm" />}
                  </div>
                  <span className="text-xs text-[var(--warm-gray)] group-hover:text-[var(--off-white)] transition-colors">
                    {perm.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[var(--black)]/95 backdrop-blur-md pb-4 pt-6 -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-6 mb-6 border-b border-[var(--dark-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--gold)]" style={{ fontFamily: "Playfair Display, serif" }}>Staff Management</h2>
          <p className="text-sm text-[var(--warm-gray)] mt-1">Create and manage staff accounts, set permissions per user.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn-gold px-4 py-2 flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-[var(--dark-card)] border border-[var(--gold)]/30 rounded-xl p-6 space-y-5">
          <h3 className="font-semibold text-[var(--off-white)] flex items-center gap-2"><Plus size={16} className="text-[var(--gold)]" /> New Staff Account</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[var(--warm-gray)] mb-1">Full Name</label>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Amaka Johnson"
                className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]" />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] mb-1">Email Address *</label>
              <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                placeholder="e.g. amaka@odmgroove.com"
                className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-[var(--warm-gray)] mb-1">Default Password *</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Temporary password — staff can change after first login"
                  className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 pr-10 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--warm-gray)] hover:text-[var(--gold)]">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-[var(--warm-gray)] mb-3">Permissions</label>
            <PermissionGrid selected={newPerms} onChange={setNewPerms} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} disabled={saving} className="btn-gold px-4 py-2 flex items-center gap-2 text-sm">
              <Save size={14} /> {saving ? "Creating..." : "Create Account"}
            </button>
            <button onClick={() => { setIsAdding(false); setNewName(""); setNewEmail(""); setNewPassword(""); setNewPerms([]); }}
              className="px-4 py-2 text-sm text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Staff List */}
      {loading ? (
        <div className="text-center py-16 text-[var(--warm-gray)]">Loading staff...</div>
      ) : (
        <div className="space-y-3">
          {staff.map(s => (
            <div key={s.id} className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl overflow-hidden">
              {editing?.id === s.id ? (
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <input type="text" value={editing.name || ""} onChange={e => setEditing({ ...editing, name: e.target.value })}
                      className="flex-1 bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]"
                      placeholder="Full name" />
                    <span className="text-xs text-[var(--warm-gray)]">{editing.email}</span>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--warm-gray)] mb-2">Permissions</p>
                    <PermissionGrid selected={editPerms} onChange={setEditPerms} />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleUpdate} disabled={saving} className="btn-gold px-4 py-1.5 flex items-center gap-1.5 text-sm">
                      <Save size={13} /> {saving ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => setEditing(null)} className="text-sm text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center text-[var(--gold)] text-sm font-bold shrink-0">
                      {(s.name || s.email)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--off-white)] text-sm">{s.name || "—"}</span>
                      {s.isSuperAdmin && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                          <ShieldCheck size={10} /> Super Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--warm-gray)]">{s.email}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(s.permissions ? JSON.parse(s.permissions) as string[] : []).slice(0, 5).map((p: string) => (
                        <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--black)] border border-[var(--dark-border)] text-[var(--warm-gray)]">
                          {p}
                        </span>
                      ))}
                      {(s.permissions ? JSON.parse(s.permissions) as string[] : []).length > 5 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--black)] border border-[var(--dark-border)] text-[var(--warm-gray)]">
                          +{(s.permissions ? JSON.parse(s.permissions) as string[] : []).length - 5} more
                        </span>
                      )}
                    </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 w-full sm:w-auto justify-between sm:justify-start mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-[var(--dark-border)] sm:border-0">
                    <span className="text-[10px] text-[var(--warm-gray)] mr-2">{s._count?.ordersHandled || 0} orders</span>
                    
                    {/* Only hide action buttons if the target is hatykuxordik and the current user is NOT hatykuxordik.
                        This allows admins to modify other admins/staff. */}
                    {!(s.email === "hatykuxordik@gmail.com" && currentUserEmail !== "hatykuxordik@gmail.com") && (
                      <>
                        <button onClick={() => { setEditing(s); setEditPerms(s.permissions ? JSON.parse(s.permissions) : []); }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleForceReset(s)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--warm-gray)] hover:text-amber-400 hover:bg-amber-400/10 transition-all" title="Force Reset Password">
                          <KeyRound size={14} />
                        </button>
                        
                        {/* Users cannot delete themselves, and hatykuxordik cannot be deleted at all. */}
                        {s.email !== currentUserEmail && s.email !== "hatykuxordik@gmail.com" && (
                          <button onClick={() => setConfirmDelete(s)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--warm-gray)] hover:text-red-400 hover:bg-red-400/10 transition-all">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {staff.length === 0 && (
            <div className="text-center py-12 text-[var(--warm-gray)]">
              <Users size={36} className="mx-auto mb-3 opacity-30" />
              <p>No staff accounts yet. Add your first staff member above.</p>
            </div>
          )}
        </div>
      )}

      {/* Password Reset Result Modal */}
      {resetResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--dark-card)] border border-[var(--gold)]/30 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <KeyRound size={18} className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--off-white)]">Password Reset</h3>
                <p className="text-xs text-[var(--warm-gray)]">{resetResult.name}</p>
              </div>
            </div>
            <div className="bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="font-mono text-[var(--gold)] font-bold">{resetResult.pass}</span>
              <button onClick={() => navigator.clipboard.writeText(resetResult.pass)}
                className="text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors">
                <Copy size={14} />
              </button>
            </div>
            <p className="text-xs text-[var(--warm-gray)]">Share this temporary password with the staff member. They can change it after logging in.</p>
            <button onClick={() => setResetResult(null)} className="btn-gold w-full py-2 text-sm">Done</button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Staff Account?"
          message={<>Remove <strong className="text-[var(--off-white)]">{confirmDelete.name || confirmDelete.email}</strong>? They will no longer be able to log in.</>}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      {alertMessage && <AlertModal title="Error" message={alertMessage} onClose={() => setAlertMessage(null)} />}

      {/* ── Success Toast ── */}
      {successMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[fadeInUp_0.3s_ease]">
          <div className="flex items-center gap-3 bg-emerald-900/90 border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-sm">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
