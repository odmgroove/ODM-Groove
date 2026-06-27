"use client";

import { useState } from "react";
import { Facebook, Twitter, Linkedin, MessageCircle, Link2, Check } from "lucide-react";

type ShareButtonsProps = {
  url: string;
  title: string;
  orientation?: "vertical" | "horizontal";
};

export default function ShareButtons({ url, title, orientation = "vertical" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle} - ${encodedUrl}`
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const wrapperClass = orientation === "vertical"
    ? "flex flex-col items-center gap-4"
    : "flex gap-3";

  return (
    <div className={wrapperClass}>
      {orientation === "vertical" && (
        <>
          <span className="text-[10px] uppercase tracking-widest text-[var(--warm-gray)] writing-vertical-rl mb-4">
            Share Article
          </span>
          <div className="w-px h-12 bg-[var(--dark-border)] mb-2"></div>
        </>
      )}

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-[var(--dark-card)] border border-[var(--dark-border)] flex items-center justify-center text-[var(--warm-gray)] hover:text-[#1877F2] hover:border-[#1877F2] transition-all"
        aria-label="Share on Facebook"
      >
        <Facebook size={16} />
      </a>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-[var(--dark-card)] border border-[var(--dark-border)] flex items-center justify-center text-[var(--warm-gray)] hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-all"
        aria-label="Share on Twitter"
      >
        <Twitter size={16} />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-[var(--dark-card)] border border-[var(--dark-border)] flex items-center justify-center text-[var(--warm-gray)] hover:text-[#0A66C2] hover:border-[#0A66C2] transition-all"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={16} />
      </a>
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-[var(--dark-card)] border border-[var(--dark-border)] flex items-center justify-center text-[var(--warm-gray)] hover:text-[#25D366] hover:border-[#25D366] transition-all"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle size={16} />
      </a>
      <button
        onClick={handleCopy}
        className={`w-10 h-10 rounded-full bg-[var(--dark-card)] border border-[var(--dark-border)] flex items-center justify-center transition-all ${
          copied 
            ? "text-emerald-400 border-emerald-400" 
            : "text-[var(--warm-gray)] hover:text-[var(--gold)] hover:border-[var(--gold)]"
        }`}
        aria-label="Copy link"
        title="Copy Link"
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
      </button>
    </div>
  );
}
