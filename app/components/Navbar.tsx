"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone, UtensilsCrossed } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Our Story", href: "/#about" },
  { label: "Rooms", href: "/#rooms" },
  { label: "Amenities", href: "/#amenities" },
  { label: "Event Hall", href: "/#events" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60);
    const sections = navLinks.map((l) => l.href.split("#")[1]).filter(Boolean);
    let current = "home";
    for (const id of [...sections].reverse()) {
      if (!id) continue;
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 150) {
        current = id;
        break;
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[var(--black)]/95 backdrop-blur-xl border-b border-[var(--dark-border)] shadow-2xl"
            : "bg-transparent"
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-18 md:h-20">
          {/* Logo */}
          <Link
            href="/#home"
            className="flex items-center gap-3 group"
            aria-label="ODM Groove - Go to Home"
          >
            <div className="flex flex-col gap-1 items-center justify-center leading-tight">
              <span className="relative inline-block w-24 h-4 md:w-36 md:h-6">
                <Image
                  src="/logo.png"
                  alt="ODM Groove Hotel logo"
                  fill
                  className="object-contain"
                  priority
                />
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--warm-gray)] font-medium">
                Hotel &amp; Event Hall
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1" role="menubar">
            {navLinks.map((link) => {
              const id = link.href.replace("/#", "");
              const isActive = activeSection === id;
              return (
                <li key={link.href} role="none">
                  <Link
                    role="menuitem"
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium tracking-wide transition-all duration-200 relative group ${
                      isActive
                        ? "text-[var(--gold)]"
                        : "text-[var(--off-white)] hover:text-[var(--gold)]"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[var(--gold)] transition-all duration-300 ${
                        isActive ? "w-4" : "w-0 group-hover:w-4"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2">
            
            {/* Menu & Order icon-button */}
            <Link
              href="/menu"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[var(--gold)] border border-[var(--gold)]/40 rounded-full hover:bg-[var(--gold)]/10 transition-all duration-200"
              aria-label="Menu & Order"
              title="Menu & Order"
            >
              <UtensilsCrossed size={14} />
              <span className="hidden xl:inline">Order</span>
            </Link>
            <Link
              href="/#rooms"
              className="btn-gold text-xs px-5 py-2.5 inline-block text-center"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile: Menu & Order icon + Hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/menu"
              className="flex items-center gap-1.5 p-2 text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
              aria-label="Menu & Order"
            >
              <UtensilsCrossed size={20} />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[var(--off-white)] hover:text-[var(--gold)] transition-colors"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-400 ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-400 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-[var(--black)] border-l border-[var(--dark-border)] flex flex-col transition-transform duration-400 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-[var(--dark-border)]">
            <Link
              href="/#home"
              className="flex items-center gap-3 group"
              aria-label="ODM Groove - Go to Home"
            >
              <div className="flex flex-col gap-1 items-center justify-center leading-tight">
                <span className="relative inline-block w-24 h-4">
                  <Image
                    src="/logo.png"
                    alt="ODM Groove Hotel logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--warm-gray)] font-medium">
                  Hotel &amp; Event Hall
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-[var(--warm-gray)] hover:text-[var(--off-white)] transition-colors"
              aria-label="Close navigation drawer"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex-1 p-6 overflow-y-auto">
            <ul className="space-y-1">
              {navLinks.map((link) => {
                const id = link.href.replace("/#", "");
                const isActive = activeSection === id;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`w-full text-left px-4 py-3 block rounded-sm text-sm font-medium tracking-wide transition-all ${
                        isActive
                          ? "text-[var(--gold)] bg-[var(--gold)]/10"
                          : "text-[var(--off-white)] hover:text-[var(--gold)] hover:bg-[var(--dark-border)]/50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-6 border-t border-[var(--dark-border)] space-y-3">
            {/* Menu & Order — prominent mobile CTA */}
            <Link
              href="/menu"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-sm border border-[var(--gold)] text-[var(--gold)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--gold)]/10 transition-all"
            >
              <UtensilsCrossed size={15} />
              Menu &amp; Order
            </Link>
            <Link
              href="/#rooms"
              onClick={() => setMobileOpen(false)}
              className="btn-gold w-full text-center block"
            >
              Book a Room
            </Link>
            <Link
              href="/#events"
              onClick={() => setMobileOpen(false)}
              className="btn-ghost w-full text-center block"
            >
              Book an Event
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
