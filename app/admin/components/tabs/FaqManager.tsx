"use client";

import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronUp, Save, X
} from "lucide-react";
import ConfirmModal from "../ConfirmModal";
import AlertModal from "../AlertModal";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

type FormState = {
  question: string;
  answer: string;
};

const EMPTY_FORM: FormState = { question: "", answer: "" };

export default function FaqManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<FAQ | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchFaqs = async () => {
    const res = await fetch("/api/faqs");
    if (res.ok) setFaqs(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchFaqs(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (faq: FAQ) => {
    setEditId(faq.id);
    setForm({ question: faq.question, answer: faq.answer });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(editId ? `/api/faqs/${editId}` : "/api/faqs", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editId ? form : { ...form, order: faqs.length }),
      });
      if (res.ok) {
        await fetchFaqs();
        setSuccessMessage("FAQ saved successfully!");
        setShowForm(false);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error saving FAQ: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An unexpected error occurred.");
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const faq = faqs.find(f => f.id === id);
    if (faq) setConfirmDelete(faq);
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/faqs/${confirmDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setFaqs(prev => prev.filter(f => f.id !== confirmDelete.id));
        setSuccessMessage("FAQ deleted.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error deleting FAQ: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An error occurred while deleting.");
    }
    setConfirmDelete(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--off-white)]">FAQs</h2>
          <p className="text-sm text-[var(--warm-gray)]">{faqs.length} questions</p>
        </div>
        <button onClick={openAdd} className="btn-gold flex items-center gap-2 !px-4 !py-2.5 !text-xs">
          <Plus size={14} /> Add FAQ
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[var(--dark-card)] border border-[var(--gold)]/30 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-[var(--off-white)] mb-4">{editId ? "Edit FAQ" : "New FAQ"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Question</label>
              <input
                value={form.question}
                onChange={e => setForm({ ...form, question: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50"
                placeholder="e.g. What are check-in times?"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--warm-gray)] uppercase tracking-wider mb-1">Answer</label>
              <textarea
                rows={4}
                value={form.answer}
                onChange={e => setForm({ ...form, answer: e.target.value })}
                className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--off-white)] focus:outline-none focus:border-[var(--gold)]/50 resize-none"
                placeholder="The full answer..."
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-gold flex items-center gap-2 !px-4 !py-2 !text-xs">
                <Save size={13} /> {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setShowForm(false)} className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border border-[var(--dark-border)] text-[var(--warm-gray)] hover:text-[var(--off-white)]">
                <X size={13} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-[var(--warm-gray)]">Loading...</p>
      ) : faqs.length === 0 ? (
        <div className="text-center py-16 text-[var(--warm-gray)]">No FAQs yet. Add one above!</div>
      ) : (
        <div className="space-y-3">
          {faqs.map(faq => (
            <div key={faq.id} className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl overflow-hidden">
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-[var(--dark-border)]/20 transition-colors"
                onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
              >
                <p className="font-medium text-[var(--off-white)] text-sm flex-1 pr-4">{faq.question}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={e => { e.stopPropagation(); openEdit(faq); }} className="p-1.5 rounded-lg text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all">
                    <Pencil size={14} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(faq.id); }} className="p-1.5 rounded-lg text-[var(--warm-gray)] hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={14} />
                  </button>
                  {expanded === faq.id ? <ChevronUp size={16} className="text-[var(--warm-gray)]" /> : <ChevronDown size={16} className="text-[var(--warm-gray)]" />}
                </div>
              </div>
              {expanded === faq.id && (
                <div className="px-5 pb-5 border-t border-[var(--dark-border)]">
                  <p className="text-sm text-[var(--warm-gray)] pt-4 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete FAQ?"
          message={<>The question <strong className="text-[var(--off-white)]">&ldquo;{confirmDelete.question}&rdquo;</strong> will be permanently removed.</>}
          onConfirm={confirmAndDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {alertMessage && (
        <AlertModal
          title="Error"
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}

      {/* ── Success Toast ── */}
      {successMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
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
