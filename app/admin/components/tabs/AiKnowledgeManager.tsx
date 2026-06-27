"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Bot, Tag, MessageSquare } from "lucide-react";
import ConfirmModal from "../ConfirmModal";
import AlertModal from "../AlertModal";

type Rule = {
  id: string;
  question: string | null;
  keywords: string;
  response: string;
  order: number;
  createdAt: string;
};

const DEFAULT_RULES: Omit<Rule, "id" | "createdAt">[] = [
  { question: "How much is a room?", keywords: "price,cost,how much,room,rate", response: "Our Standard Room is ₦30,000/night and our Deluxe Room (with pool access) is ₦50,000/night. Both include free breakfast, WiFi, DSTV & Netflix.", order: 1 },
  { question: "Where are you located?", keywords: "location,where,address,find you", response: "We are at Shonekan Street, Ola-Oparun, After Aboki Ifa Villa in Ijoko Ogbayo, Ogun State — just minutes from Lagos.", order: 2 },
  { question: "Event hall capacity?", keywords: "event,hall,wedding,capacity,seminar,conference", response: "Our event hall accommodates 200+ guests. Perfect for weddings, birthdays, and corporate events. Contact our front desk for rates.", order: 3 },
  { question: "Do you have a pool?", keywords: "pool,swim,bar,club,lounge,nightclub", response: "Yes! We have an outdoor pool, rooftop VIP lounge, outdoor bar, nightclub, and a sports lounge for snooker & football viewing.", order: 4 },
  { question: "How to book?", keywords: "book,reserve,contact,availability", response: "You can book via WhatsApp using the buttons on our site, or call our front desk. We offer a 10% discount for stays of 3+ nights!", order: 5 },
];

export default function AiKnowledgeManager() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Rule | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newKeywords, setNewKeywords] = useState("");
  const [newResponse, setNewResponse] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Rule | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-knowledge");
      if (res.ok) {
        setRules(await res.json());
      } else {
        const err = await res.json();
        setAlertMessage(err.error || "Failed to fetch rules. Prisma client might be out of sync.");
      }
    } catch (error) {
      setAlertMessage("Failed to communicate with the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRules(); }, []);

  const handleSeedDefaults = async () => {
    setSaving(true);
    let hasError = false;
    for (const rule of DEFAULT_RULES) {
      try {
        const res = await fetch("/api/ai-knowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rule),
        });
        if (!res.ok) hasError = true;
      } catch (err) {
        hasError = true;
      }
    }
    if (hasError) {
      setAlertMessage("Failed to seed rules. The database schema might be out of sync with the Prisma Client.");
    } else {
      setSuccessMessage("Rules seeded successfully.");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    await fetchRules();
    setSaving(false);
  };

  const handleAdd = async () => {
    if (!newKeywords.trim() || !newResponse.trim()) {
      setAlertMessage("Both keywords and response are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/ai-knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion, keywords: newKeywords, response: newResponse, order: rules.length + 1 }),
      });
      if (res.ok) {
        setNewQuestion(""); setNewKeywords(""); setNewResponse(""); setIsAdding(false);
        await fetchRules();
        setSuccessMessage("Rule added successfully.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error adding rule: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An error occurred while adding rule.");
    }
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/ai-knowledge/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: editing.question, keywords: editing.keywords, response: editing.response, order: editing.order }),
      });
      if (res.ok) {
        setEditing(null);
        await fetchRules();
        setSuccessMessage("Rule updated successfully.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error updating rule: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An error occurred while updating rule.");
    }
    setSaving(false);
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/ai-knowledge/${confirmDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setRules(prev => prev.filter(r => r.id !== confirmDelete.id));
        setSuccessMessage("Rule deleted.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage(`Error deleting rule: ${await res.text()}`);
      }
    } catch (e) {
      setAlertMessage("An error occurred while deleting.");
    }
    setConfirmDelete(null);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--gold)]" style={{ fontFamily: "Playfair Display, serif" }}>
            AI Chatbot Knowledge Base
          </h2>
          <p className="text-sm text-[var(--warm-gray)] mt-1">
            Manage what the AI concierge knows. Each rule is a set of trigger keywords and the response to give.
          </p>
        </div>
        <div className="flex gap-3">
          {rules.length === 0 && !loading && (
            <button
              onClick={handleSeedDefaults}
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold border border-[var(--gold)]/40 text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-all"
            >
              Seed Default Rules
            </button>
          )}
          <button
            onClick={() => setIsAdding(true)}
            className="btn-gold px-4 py-2 flex items-center gap-2"
          >
            <Plus size={16} /> Add Rule
          </button>
        </div>
      </div>

      {/* How it works callout */}
      <div className="bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-xl p-4 flex gap-3 items-start">
        <Bot size={20} className="text-[var(--gold)] shrink-0 mt-0.5" />
        <div className="text-sm text-[var(--warm-gray)]">
          <strong className="text-[var(--off-white)]">How it works:</strong> When a visitor types a message in the chat widget, the bot checks if the message contains any of the <span className="text-[var(--gold)]">keywords</span> from any rule. If it matches, it sends back the corresponding <span className="text-[var(--gold)]">response</span>. Rules are checked in order.
        </div>
      </div>

      {/* Add Rule Form */}
      {isAdding && (
        <div className="bg-[var(--dark-card)] border border-[var(--gold)]/30 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-[var(--off-white)] flex items-center gap-2">
            <Plus size={16} className="text-[var(--gold)]" /> New Rule
          </h3>
          <div>
            <label className="block text-xs text-[var(--warm-gray)] mb-1 flex items-center gap-1.5">
              Suggested Question (Optional)
            </label>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]"
              placeholder="e.g. How much is a room?"
            />
            <p className="text-[10px] text-[var(--warm-gray)] mt-1">If provided, this will appear as a clickable suggestion button in the chat widget.</p>
          </div>
          <div>
            <label className="block text-xs text-[var(--warm-gray)] mb-1 flex items-center gap-1.5">
              <Tag size={11} /> Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={newKeywords}
              onChange={(e) => setNewKeywords(e.target.value)}
              className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]"
              placeholder="e.g. price, cost, how much, rate"
            />
            <p className="text-[10px] text-[var(--warm-gray)] mt-1">If the user&apos;s message contains ANY of these words, this rule fires.</p>
          </div>
          <div>
            <label className="block text-xs text-[var(--warm-gray)] mb-1 flex items-center gap-1.5">
              <MessageSquare size={11} /> Bot Response
            </label>
            <textarea
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              rows={3}
              className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)] resize-y"
              placeholder="What should the bot reply?"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={saving} className="btn-gold px-4 py-2 flex items-center gap-2 text-sm">
              <Save size={14} /> {saving ? "Saving..." : "Save Rule"}
            </button>
            <button onClick={() => { setIsAdding(false); setNewQuestion(""); setNewKeywords(""); setNewResponse(""); }} className="px-4 py-2 text-sm text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      {loading ? (
        <div className="text-center text-[var(--warm-gray)] py-16">Loading rules...</div>
      ) : rules.length === 0 ? (
        <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-12 text-center">
          <Bot size={36} className="mx-auto mb-3 text-[var(--warm-gray)] opacity-40" />
          <p className="text-[var(--warm-gray)]">No AI rules yet. Add your first rule or seed the defaults above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule, idx) => (
            <div key={rule.id} className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl overflow-hidden">
              {editing?.id === rule.id ? (
                // ── Edit form ──
                <div className="p-5 space-y-3">
                  <div>
                    <label className="block text-xs text-[var(--warm-gray)] mb-1">Suggested Question (Optional)</label>
                    <input
                      type="text"
                      value={editing.question || ""}
                      onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                      className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--warm-gray)] mb-1">Keywords</label>
                    <input
                      type="text"
                      value={editing.keywords}
                      onChange={(e) => setEditing({ ...editing, keywords: e.target.value })}
                      className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--warm-gray)] mb-1">Response</label>
                    <textarea
                      value={editing.response}
                      onChange={(e) => setEditing({ ...editing, response: e.target.value })}
                      rows={3}
                      className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-lg px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)] resize-y"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleUpdate} disabled={saving} className="btn-gold px-4 py-1.5 flex items-center gap-1.5 text-sm">
                      <Save size={13} /> {saving ? "Saving..." : "Update"}
                    </button>
                    <button onClick={() => setEditing(null)} className="px-4 py-1.5 text-sm text-[var(--warm-gray)] hover:text-[var(--off-white)] flex items-center gap-1.5">
                      <X size={13} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // ── Display row ──
                <div className="flex items-start gap-4 p-5">
                  <div className="w-7 h-7 shrink-0 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center text-[10px] font-bold text-[var(--gold)]">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {rule.keywords.split(",").map(k => (
                        <span key={k} className="bg-[var(--black)] border border-[var(--dark-border)] text-[var(--gold)] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                          {k.trim()}
                        </span>
                      ))}
                      {rule.question && (
                        <>
                          <span className="text-[var(--warm-gray)]/50 text-[10px] mx-1">•</span>
                          <span className="text-[10px] text-[var(--warm-gray)] flex items-center gap-1 bg-[var(--black)] border border-[var(--dark-border)] px-2 py-0.5 rounded-full">
                            <MessageSquare size={9} className="opacity-70" /> {rule.question}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-[var(--warm-gray)] leading-relaxed">{rule.response}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setEditing(rule)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setConfirmDelete(rule)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--warm-gray)] hover:text-red-400 hover:bg-red-400/10 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Rule?"
          message={<>Remove the rule triggered by <strong className="text-[var(--off-white)]">&ldquo;{confirmDelete.keywords}&rdquo;</strong>? The bot will no longer respond to these keywords.</>}
          onConfirm={confirmAndDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Alert Modal */}
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
