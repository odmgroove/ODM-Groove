"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus, Edit2, Trash2, CheckCircle, X, Search, FileText,
  Image as ImageIcon, Bold, Italic, Heading2, Heading3,
  Quote, Minus, List, UploadCloud, AlertTriangle, Eye, EyeOff, LayoutTemplate
} from "lucide-react";
import ConfirmModal from "../ConfirmModal";
import AlertModal from "../AlertModal";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  author: string;
  published: boolean;
  tags: string | null;
  createdAt: string;
};

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmDeleteModal({
  title,
  onConfirm,
  onCancel,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-[var(--dark)] border border-[var(--dark-border)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-400" />
        <div className="p-6">
          <button onClick={onCancel} className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-[var(--dark-card)] text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-colors">
            <X size={14} />
          </button>
          <div className="flex flex-col items-center gap-4 text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[var(--off-white)] mb-1">Delete Post?</h2>
              <p className="text-sm text-[var(--warm-gray)]">
                &ldquo;<span className="text-[var(--off-white)] font-semibold">{title}</span>&rdquo; will be permanently removed.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-[var(--dark-border)] text-sm font-semibold text-[var(--warm-gray)] hover:text-[var(--off-white)] hover:bg-[var(--dark-card)] transition-all">Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-bold transition-all active:scale-[0.98]">Yes, Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Templates ────────────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    name: "Standard Article",
    html: `<p>Write your opening paragraph here. Hook your readers.</p>\n\n<h2>A Strong Subheading</h2>\n<p>Elaborate on your main topic. Share insights, stories, or news.</p>\n\n<blockquote class="blog-quote">Include a powerful quote or highlight from the article here.</blockquote>\n\n<img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop" alt="Standard Image" class="blog-inline-image" />\n\n<p>Wrap up your thoughts and provide a strong conclusion.</p>`,
  },
  {
    name: "Image Grid (2 Columns)",
    html: `<p>Introduce your gallery or dual-image showcase here.</p>\n\n<div class="blog-grid-2">\n  <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop" alt="Left Image" />\n  <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop" alt="Right Image" />\n</div>\n\n<p>Add a caption or closing remarks about these images.</p>`,
  },
  {
    name: "Image Gallery (3 Columns)",
    html: `<p>A beautiful 3-column masonry-style grid to show off multiple photos from an event.</p>\n\n<div class="blog-grid-3">\n  <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop" alt="Grid Image 1" />\n  <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop" alt="Grid Image 2" />\n  <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop" alt="Grid Image 3" />\n</div>`,
  },
  {
    name: "Asymmetric Masonry Showcase",
    html: `<p>Use this stunning asymmetric layout to highlight one main photo alongside two smaller supporting photos.</p>\n\n<div class="blog-grid-asymmetric">\n  <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop" alt="Main Highlight" />\n  <div class="blog-grid-col">\n    <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop" alt="Side Image 1" />\n    <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop" alt="Side Image 2" />\n  </div>\n</div>`,
  },
  {
    name: "Text & Image Split View",
    html: `<p>An elegant side-by-side layout for storytelling.</p>\n\n<div class="blog-split-view">\n  <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop" alt="Story Image" />\n  <div>\n    <h3>The Story Behind It</h3>\n    <p>Describe the details here. This text will sit beautifully next to the image on desktop and stack neatly on mobile screens.</p>\n  </div>\n</div>`,
  },
  {
    name: "Interview / Q&A",
    html: `<p>Brief introduction to the guest or interviewee.</p>\n\n<hr class="blog-divider" />\n\n<p><strong>Interviewer:</strong> What is your background and how did you get started?</p>\n<p><strong>Guest:</strong> Enter the guest's response here...</p>\n\n<hr class="blog-divider" />\n\n<p><strong>Interviewer:</strong> What is your favorite memory from ODM Groove?</p>\n<p><strong>Guest:</strong> Enter the response here...</p>`,
  }
];

// ─── Rich Content Editor ───────────────────────────────────────────────────────
function RichEditor({
  value,
  onChange,
  onError,
}: {
  value: string;
  onChange: (v: string) => void;
  onError: (msg: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inlineFileRef = useRef<HTMLInputElement>(null);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [preview, setPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const insertAtCursor = (before: string, after = "", placeholder = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end) || placeholder;
    const newVal = ta.value.substring(0, start) + before + selected + after + ta.value.substring(end);
    onChange(newVal);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const insertBlock = (block: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const newVal = ta.value.substring(0, pos) + "\n" + block + "\n" + ta.value.substring(pos);
    onChange(newVal);
    setTimeout(() => ta.focus(), 0);
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingInline(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const blob = await res.json();
      insertBlock(`<img src="${blob.url}" alt="${file.name.replace(/\.[^/.]+$/, "")}" class="blog-inline-image" />`);
    } catch {
      onError("Image upload failed. Check your Vercel Blob configuration.");
    } finally {
      setUploadingInline(false);
      if (inlineFileRef.current) inlineFileRef.current.value = "";
    }
  };

  const TOOLBAR = [
    { icon: <Bold size={14} />, label: "Bold", action: () => insertAtCursor("<strong>", "</strong>", "bold text") },
    { icon: <Italic size={14} />, label: "Italic", action: () => insertAtCursor("<em>", "</em>", "italic text") },
    { icon: <Heading2 size={14} />, label: "Heading 2", action: () => insertBlock("<h2>Section Heading</h2>") },
    { icon: <Heading3 size={14} />, label: "Heading 3", action: () => insertBlock("<h3>Subheading</h3>") },
    { icon: <Quote size={14} />, label: "Quote", action: () => insertBlock('<blockquote class="blog-quote">Your powerful quote goes here...</blockquote>') },
    { icon: <List size={14} />, label: "List", action: () => insertBlock("<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>") },
    { icon: <Minus size={14} />, label: "Divider", action: () => insertBlock('<hr class="blog-divider" />') },
  ];

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-[var(--black)] border border-[var(--dark-border)] rounded-t-lg px-2 py-1.5">
        {TOOLBAR.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.label}
            onClick={t.action}
            className="p-1.5 rounded text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all"
          >
            {t.icon}
          </button>
        ))}

        <div className="w-px h-5 bg-[var(--dark-border)] mx-1" />

        {/* Inline Image Upload */}
        <button
          type="button"
          title="Insert Image"
          onClick={() => inlineFileRef.current?.click()}
          disabled={uploadingInline}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all disabled:opacity-40"
        >
          {uploadingInline ? (
            <span className="animate-spin w-3 h-3 border border-current border-t-transparent rounded-full" />
          ) : (
            <UploadCloud size={13} />
          )}
          <span>{uploadingInline ? "Uploading…" : "Insert Image"}</span>
        </button>
        <input ref={inlineFileRef} type="file" accept="image/*" className="hidden" onChange={handleInlineImageUpload} />

        {/* Templates Dropdown */}
        <div className="relative">
          <button
            type="button"
            title="Templates"
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[var(--warm-gray)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all"
          >
            <LayoutTemplate size={13} />
            <span>Templates</span>
          </button>
          {showTemplates && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-[var(--dark)] border border-[var(--dark-border)] rounded-lg shadow-xl overflow-hidden z-50">
              {TEMPLATES.map(tpl => (
                <button
                  key={tpl.name}
                  type="button"
                  onClick={() => {
                    onChange(tpl.html);
                    setShowTemplates(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-xs text-[var(--off-white)] hover:bg-[var(--gold)]/20 hover:text-[var(--gold)] transition-colors"
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Preview Toggle (Mobile Only) */}
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className={`lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${preview ? "bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30" : "text-[var(--warm-gray)] hover:text-[var(--off-white)]"}`}
        >
          {preview ? <EyeOff size={13} /> : <Eye size={13} />}
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      {/* Editor / Preview area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 bg-[var(--dark-card)] border border-[var(--dark-border)] border-t-0 rounded-b-lg overflow-hidden h-[500px]">
        {/* Editor Pane (Left on Desktop, toggled on Mobile) */}
        <textarea
          ref={textareaRef}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-full p-4 text-[var(--off-white)] bg-transparent focus:outline-none font-mono text-sm leading-relaxed resize-none ${preview ? 'hidden lg:block' : 'block'}`}
          placeholder={`Write your blog content using HTML tags.\n\nExample structure:\n<p>Your opening paragraph...</p>\n<h2>A Section Heading</h2>\n<p>More content here...</p>\n<blockquote class="blog-quote">A great quote or highlight...</blockquote>\n<img src="..." alt="Description" class="blog-inline-image" />\n<p>Continue the story...</p>`}
          spellCheck
        />

        {/* Live Preview Pane (Right on Desktop, toggled on Mobile) */}
        <div 
          className={`w-full h-full bg-[var(--black)] p-6 overflow-y-auto border-l border-[var(--dark-border)] blog-content-preview prose prose-invert prose-sm max-w-none ${preview ? 'block' : 'hidden lg:block'}`}
          dangerouslySetInnerHTML={{ __html: value || "<p class='text-[var(--warm-gray)] opacity-50 italic'>Live preview will appear here...</p>" }}
        />
      </div>

      <p className="text-[10px] text-[var(--warm-gray)] mt-2">
        Tip: Choose a Template to start quickly, or use the toolbar. Click <strong className="text-[var(--off-white)]">Insert Image</strong> to upload photos directly.
      </p>
    </div>
  );
}

// ─── Main Blog Manager ────────────────────────────────────────────────────────
export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<BlogPost | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);

  // Auto-dismiss success toast
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);


  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        setPosts(await res.json());
      } else {
        const err = await res.json().catch(() => ({}));
        setAlertMessage(err.error || `Failed to load blog posts (${res.status}). Please refresh.`);
      }
    } catch (e) {
      console.error(e);
      setAlertMessage("Network error while loading blog posts. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost?.title || !currentPost?.content) return;
    setIsSubmitting(true);
    const isNew = !currentPost.id;
    const url = isNew ? "/api/admin/blog" : `/api/admin/blog/${currentPost.id}`;
    try {
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentPost),
      });
      if (res.ok) {
        setIsEditing(false);
        setCurrentPost(null);
        fetchPosts();
        setSuccessMessage(isNew ? "Post created successfully!" : "Post updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
      else setAlertMessage("Failed to save post. Please try again.");
    } catch { setAlertMessage("An error occurred while saving the post."); }
    finally { setIsSubmitting(false); }
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/admin/blog/${confirmDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== confirmDelete.id));
        setSuccessMessage("Post deleted.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAlertMessage("Failed to delete post. Please try again.");
      }
    } catch (err) { console.error(err); }
    setConfirmDelete(null);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const blob = await res.json();
      setCurrentPost((p) => ({ ...p, coverImage: blob.url }));
    } catch { setAlertMessage("Cover image upload failed. Check your Vercel Blob configuration."); }
    finally { setUploadingCover(false); }
  };

  const filtered = posts.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || (p.tags && p.tags.toLowerCase().includes(search.toLowerCase()))
  );

  // ── Editor View ──────────────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--gold)]" style={{ fontFamily: "Playfair Display, serif" }}>
            {currentPost?.id ? "Edit Post" : "New Post"}
          </h2>
          <button
            onClick={() => { setIsEditing(false); setCurrentPost(null); }}
            className="flex items-center gap-2 text-[var(--warm-gray)] hover:text-white transition-colors"
          >
            <X size={20} /> Cancel
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left: Main Content ── */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--warm-gray)] mb-2">Title *</label>
                <input
                  type="text" required
                  value={currentPost?.title || ""}
                  onChange={(e) => setCurrentPost((p) => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-sm px-4 py-3 text-[var(--off-white)] text-xl font-semibold focus:border-[var(--gold)] outline-none"
                  placeholder="Post title..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--warm-gray)] mb-2">Excerpt <span className="normal-case text-[var(--warm-gray)]/60">(shown on blog card)</span></label>
                <textarea
                  rows={2}
                  value={currentPost?.excerpt || ""}
                  onChange={(e) => setCurrentPost((p) => ({ ...p, excerpt: e.target.value }))}
                  className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-sm px-4 py-3 text-[var(--off-white)] focus:border-[var(--gold)] outline-none resize-none"
                  placeholder="Short summary for the blog feed..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--warm-gray)] mb-2">
                  Article Content *
                  <span className="normal-case ml-2 text-[var(--warm-gray)]/60">— Supports HTML + inline images</span>
                </label>
                <RichEditor
                  value={currentPost?.content || ""}
                  onChange={(v) => setCurrentPost((p) => ({ ...p, content: v }))}
                  onError={setAlertMessage}
                />
              </div>
            </div>

            {/* ── Right: Sidebar ── */}
            <div className="space-y-5">

              {/* Publishing */}
              <div className="bg-[var(--dark-card)] p-5 border border-[var(--dark-border)] rounded-sm space-y-4">
                <p className="text-xs uppercase tracking-widest text-[var(--warm-gray)]">Publishing</p>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentPost?.published || false}
                    onChange={(e) => setCurrentPost((p) => ({ ...p, published: e.target.checked }))}
                    className="w-4 h-4 accent-[var(--gold)]"
                  />
                  <span className="text-sm text-[var(--off-white)]">Published</span>
                </label>

                <div>
                  <label className="block text-xs text-[var(--warm-gray)] mb-1">Author</label>
                  <input
                    type="text"
                    value={currentPost?.author || "ODM Groove"}
                    onChange={(e) => setCurrentPost((p) => ({ ...p, author: e.target.value }))}
                    className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-sm px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--warm-gray)] mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={currentPost?.slug || ""}
                    onChange={(e) => setCurrentPost((p) => ({ ...p, slug: e.target.value }))}
                    className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-sm px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)] font-mono"
                    placeholder="auto-generated-from-title"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--warm-gray)] mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={currentPost?.tags || ""}
                    onChange={(e) => setCurrentPost((p) => ({ ...p, tags: e.target.value }))}
                    className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-sm px-3 py-2 text-sm text-[var(--off-white)] outline-none focus:border-[var(--gold)]"
                    placeholder="Events, Hospitality"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="bg-[var(--dark-card)] p-5 border border-[var(--dark-border)] rounded-sm space-y-3">
                <p className="text-xs uppercase tracking-widest text-[var(--warm-gray)]">Cover Image</p>
                <p className="text-[10px] text-[var(--warm-gray)]/70">This is the hero image shown at the top of your article and on blog card previews.</p>

                {currentPost?.coverImage ? (
                  <div className="relative aspect-video rounded-sm overflow-hidden border border-[var(--dark-border)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentPost.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCurrentPost((p) => ({ ...p, coverImage: null }))}
                      className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full text-white hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-video bg-[var(--black)] border border-dashed border-[var(--dark-border)] rounded-sm flex flex-col items-center justify-center text-[var(--warm-gray)]">
                    <ImageIcon size={24} className="mb-2 opacity-50" />
                    <span className="text-xs">No cover image</span>
                  </div>
                )}

                <input type="file" accept="image/*" ref={coverFileRef} className="hidden" onChange={handleCoverUpload} />
                <button
                  type="button"
                  onClick={() => coverFileRef.current?.click()}
                  disabled={uploadingCover}
                  className="w-full py-2 bg-[var(--black)] border border-[var(--gold)]/30 text-[var(--gold)] text-sm rounded-sm hover:bg-[var(--gold)]/10 transition-colors disabled:opacity-50"
                >
                  {uploadingCover ? "Uploading…" : "Upload Cover Image"}
                </button>
              </div>

              {/* Inline Images help */}
              <div className="bg-[var(--dark-card)] p-4 border border-[var(--dark-border)] rounded-sm">
                <p className="text-xs uppercase tracking-widest text-[var(--warm-gray)] mb-2">Inline Images</p>
                <p className="text-[11px] text-[var(--warm-gray)] leading-relaxed">
                  To add images <em>inside</em> your article body, use the <strong className="text-[var(--gold)]">Insert Image</strong> button in the editor toolbar above. Uploaded images will be embedded directly into your content.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-[var(--dark-border)] pt-6">
            <button type="submit" disabled={isSubmitting} className="btn-gold px-8 py-3 flex items-center gap-2">
              {isSubmitting ? "Saving…" : <><CheckCircle size={18} /> Save Post</>}
            </button>
          </div>
        </form>

        {alertMessage && (
          <AlertModal
            title="Error"
            message={alertMessage}
            onClose={() => setAlertMessage(null)}
          />
        )}
      </div>
    );
  }

  // ── Posts List View ──────────────────────────────────────────────────────────
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[var(--gold)]" style={{ fontFamily: "Playfair Display, serif" }}>Blog Manager</h2>
          <p className="text-sm text-[var(--warm-gray)] mt-1">Create and manage your articles and news.</p>
        </div>
        <button
          onClick={() => { setCurrentPost({ published: false, author: "ODM Groove" }); setIsEditing(true); }}
          className="btn-gold px-4 py-2 flex items-center gap-2"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-sm p-4 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]" />
          <input
            type="text" placeholder="Search posts..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--black)] border border-[var(--dark-border)] rounded-sm pl-10 pr-4 py-2.5 text-sm text-[var(--off-white)] focus:border-[var(--gold)] outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--gold)]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-sm">
          <FileText size={32} className="mx-auto text-[var(--warm-gray)] mb-3 opacity-50" />
          <p className="text-[var(--warm-gray)]">No posts found.</p>
        </div>
      ) : (
        <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--black)] border-b border-[var(--dark-border)]">
                <tr>
                  <th className="px-6 py-4 font-semibold text-[var(--warm-gray)]">Title</th>
                  <th className="px-6 py-4 font-semibold text-[var(--warm-gray)]">Status</th>
                  <th className="px-6 py-4 font-semibold text-[var(--warm-gray)]">Date</th>
                  <th className="px-6 py-4 font-semibold text-[var(--warm-gray)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--dark-border)]">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-[var(--black)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--off-white)]">{post.title}</div>
                      <div className="text-xs text-[var(--warm-gray)] mt-0.5">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      {post.published ? (
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-wider rounded-sm font-bold">Published</span>
                      ) : (
                        <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] uppercase tracking-wider rounded-sm font-bold">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[var(--warm-gray)]">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setCurrentPost(post); setIsEditing(true); }} className="p-2 text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors inline-block" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setConfirmDelete(post)} className="p-2 text-[var(--warm-gray)] hover:text-red-400 transition-colors inline-block ml-2" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Post"
          message={<>&ldquo;<strong className="text-[var(--off-white)]">{confirmDelete.title}</strong>&rdquo; will be permanently removed.</>}
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
