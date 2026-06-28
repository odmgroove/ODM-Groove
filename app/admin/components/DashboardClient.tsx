"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Calendar,
  Coffee,
  BedDouble,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  FileText,
  CalendarCheck,
  Bot,
  ChefHat,
  Package,
  History,
  BarChart3,
  Users,
  type LucideIcon,
} from "lucide-react";

// Tab components
import EventsManager from "./tabs/EventsManager";
import MenuManager from "./tabs/MenuManager";
import RoomsManager from "./tabs/RoomsManager";
import TestimonialsManager from "./tabs/TestimonialsManager";
import FaqManager from "./tabs/FaqManager";
import GalleryManager from "./tabs/GalleryManager";
import SettingsManager from "./tabs/SettingsManager";
import BlogManager from "./tabs/BlogManager";
import BookingsManager from "./tabs/BookingsManager";
import AiKnowledgeManager from "./tabs/AiKnowledgeManager";

// ERP components
import DepartmentBoard from "./tabs/DepartmentBoard";
import InventoryManager from "./tabs/InventoryManager";
import AnalyticsManager from "./tabs/AnalyticsManager";
import ShiftManager from "./tabs/ShiftManager";
import StaffManager from "./tabs/StaffManager";

type AdminUserSession = {
  id: string;
  email: string;
  name: string | null;
  isSuperAdmin: boolean;
  permissions: string | null;
};

const ALL_TABS = [
  { id: "kds",          label: "Department Board", icon: ChefHat,       requiredPerm: ["view:kitchen", "view:bar"] },
  { id: "shifts",       label: "Shifts",           icon: History,       requiredPerm: ["view:shifts"] },
  { id: "inventory",    label: "Inventory",        icon: Package,       requiredPerm: ["manage:inventory"] },
  { id: "analytics",    label: "Analytics",        icon: BarChart3,     requiredPerm: ["view:analytics"] },
  { id: "bookings",     label: "Bookings",         icon: CalendarCheck, requiredPerm: ["view:bookings"] },
  { id: "events",       label: "Events",           icon: Calendar,      requiredPerm: ["manage:events"] },
  { id: "menu",         label: "Menu",             icon: Coffee,        requiredPerm: [] },
  { id: "rooms",        label: "Rooms",            icon: BedDouble,     requiredPerm: ["manage:rooms"] },
  { id: "testimonials", label: "Testimonials",     icon: MessageSquare, requiredPerm: [] },
  { id: "faq",          label: "FAQs",             icon: HelpCircle,    requiredPerm: ["manage:faqs"] },
  { id: "gallery",      label: "Gallery",          icon: ImageIcon,     requiredPerm: ["manage:gallery"] },
  { id: "blog",         label: "Blog",             icon: FileText,      requiredPerm: ["manage:blog"] },
  { id: "ai-knowledge", label: "AI Chatbot",       icon: Bot,           requiredPerm: ["manage:ai"] },
  { id: "staff",        label: "Staff",            icon: Users,         requiredPerm: ["manage:staff"] },
  { id: "settings",     label: "Settings",         icon: Settings,      requiredPerm: [] },
];

// ── Global Tooltip Context Type ────────────────────────────────────────────────
type TooltipData = {
  label: string;
  top: number;
  isActive: boolean;
} | null;

// ── Custom Tooltip Sidebar Item ───────────────────────────────────────────────
function SidebarItem({
  icon: Icon,
  label,
  isActive,
  collapsed,
  onClick,
  setTooltip,
}: {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
  setTooltip: (data: TooltipData) => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!collapsed) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({ label, top: rect.top + rect.height / 2, isActive });
      }}
      onMouseLeave={() => setTooltip(null)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
        ${isActive
          ? "bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30"
          : "text-[var(--warm-gray)] hover:bg-[var(--dark-card)] hover:text-[var(--off-white)] border border-transparent"
        } ${collapsed ? "justify-center" : "justify-start"}`}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && (
        <span className="whitespace-nowrap text-sm leading-none">{label}</span>
      )}
    </button>
  );
}

// ── Footer Item with Tooltip ──────────────────────────────────────────────────
function SidebarFooterItem({
  icon: Icon,
  label,
  collapsed,
  className = "",
  onClick,
  href,
  setTooltip,
}: {
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  className?: string;
  onClick?: () => void;
  href?: string;
  setTooltip: (data: TooltipData) => void;
}) {
  const baseClass = `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${collapsed ? "justify-center" : "justify-start"} ${className}`;

  const inner = (
    <>
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </>
  );

  const handleEnter = (e: React.MouseEvent) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ label, top: rect.top + rect.height / 2, isActive: false });
  };

  if (href) {
    return (
      <Link 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={baseClass}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setTooltip(null)}
      >
        {inner}
      </Link>
    );
  }
  return (
    <button 
      onClick={onClick} 
      className={baseClass}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setTooltip(null)}
    >
      {inner}
    </button>
  );
}

// ── Dashboard Client ──────────────────────────────────────────────────────────
export default function DashboardClient({ user }: { user: AdminUserSession }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const perms = user.permissions ? JSON.parse(user.permissions) : [];

  const TABS = ALL_TABS.filter(tab => {
    if (user.isSuperAdmin) return true;
    if (perms.includes("manage:staff")) return true;
    if (tab.requiredPerm.length === 0) return true;
    return tab.requiredPerm.some(p => perms.includes(p));
  });

  const urlTab = searchParams.get("tab");
  const defaultTab = TABS.length > 0 ? TABS[0].id : "settings";
  const activeTab = urlTab && TABS.some(t => t.id === urlTab) ? urlTab : defaultTab;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipData>(null);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "kds":          return <DepartmentBoard userPermissions={perms} />;
      case "shifts":       return <ShiftManager staffId={user.id} staffName={user.name || user.email} userPermissions={perms} />;
      case "inventory":    return <InventoryManager staffId={user.id} staffName={user.name || user.email} staffEmail={user.email} />;
      case "analytics":    return <AnalyticsManager />;
      case "staff":        return <StaffManager currentUserEmail={user.email} />;
      case "events":       return <EventsManager />;
      case "bookings":     return <BookingsManager />;
      case "menu":         return <MenuManager />;
      case "rooms":        return <RoomsManager />;
      case "testimonials": return <TestimonialsManager />;
      case "faq":          return <FaqManager />;
      case "blog":         return <BlogManager />;
      case "ai-knowledge": return <AiKnowledgeManager />;
      case "gallery":      return <GalleryManager />;
      case "settings":     return <SettingsManager />;
      default:             return null;
    }
  };

  const collapsed = isDesktopCollapsed && !isSidebarOpen;

  return (
    <div className="min-h-screen bg-[var(--black)] text-[var(--off-white)] flex">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-[var(--dark)] border-r border-[var(--dark-border)]
        transform transition-all duration-300 ease-in-out
        lg:static lg:translate-x-0 flex flex-col h-screen
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${isDesktopCollapsed ? "lg:w-[68px]" : "lg:w-64"} w-64
      `}>

        {/* ── Header ── */}
        <div className={`border-b border-[var(--dark-border)] flex items-center shrink-0 h-[68px] transition-all
          ${isDesktopCollapsed ? "justify-center px-2" : "justify-between px-4"}
        `}>
          {!isDesktopCollapsed && (
            <>
              <div className="overflow-hidden flex-1 min-w-0">
                <h1 className="font-display text-xl font-bold text-[var(--gold)] whitespace-nowrap leading-tight">ODM Groove</h1>
                <p className="text-xs text-[var(--warm-gray)] truncate mt-0.5">Hi, {user.name || user.email.split("@")[0]}</p>
              </div>
              {/* Mobile close */}
              <button className="lg:hidden text-[var(--warm-gray)] p-1 hover:text-[var(--off-white)] transition-colors ml-2" onClick={() => setIsSidebarOpen(false)}>
                <X size={20} />
              </button>
              {/* Desktop collapse */}
              <button
                onClick={() => setIsDesktopCollapsed(true)}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-[var(--warm-gray)] hover:bg-[var(--dark-card)] hover:text-[var(--off-white)] transition-all ml-2"
                title="Collapse sidebar"
              >
                <ChevronLeft size={18} />
              </button>
            </>
          )}

          {/* Collapsed: Only the expand button — clean, no abbreviation text */}
          {isDesktopCollapsed && (
            <>
              <button
                onClick={() => setIsDesktopCollapsed(false)}
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg text-[var(--warm-gray)] hover:bg-[var(--dark-card)] hover:text-[var(--gold)] transition-all"
                title="Expand sidebar"
              >
                <ChevronRight size={20} />
              </button>
              {/* Mobile close (visible when mobile drawer opens while desktop is collapsed) */}
              <button className="lg:hidden text-[var(--warm-gray)] p-1 hover:text-[var(--off-white)] transition-colors" onClick={() => setIsSidebarOpen(false)}>
                <X size={20} />
              </button>
            </>
          )}
        </div>

        {/* ── Scrollable Nav ── */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 sidebar-scroll">
          {TABS.map((tab) => (
            <SidebarItem
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={activeTab === tab.id}
              collapsed={collapsed}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("tab", tab.id);
                router.push(pathname + "?" + params.toString());
                setIsSidebarOpen(false);
              }}
              setTooltip={setTooltip}
            />
          ))}
        </nav>

        {/* ── Pinned Footer ── */}
        <div className="shrink-0 border-t border-[var(--dark-border)] p-2 space-y-0.5">
          <SidebarFooterItem
            icon={Home}
            label="View Site"
            collapsed={collapsed}
            href="/"
            setTooltip={setTooltip}
            className="text-[var(--warm-gray)] hover:bg-[var(--dark-card)] hover:text-[var(--off-white)]"
          />
          <SidebarFooterItem
            icon={LogOut}
            label="Logout"
            collapsed={collapsed}
            onClick={handleLogout}
            setTooltip={setTooltip}
            className="text-red-400 hover:bg-red-500/10"
          />
        </div>
      </aside>

      {/* ── Global Portal Tooltip for Collapsed Sidebar ── */}
      {/* Renders completely outside the overflowing nav to prevent CSS clipping */}
      {tooltip && collapsed && (
        <div
          className="fixed z-[9999] pointer-events-none flex items-center transition-all duration-100 ease-out"
          style={{ 
            left: '74px', // Sidebar width (64px) + margin (10px)
            top: `${tooltip.top}px`, 
            transform: 'translateY(-50%)' 
          }}
        >
          {/* Arrow caret */}
          <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '6px solid #1e1e1e' }} />
          {/* Label bubble */}
          <div className={`ml-0 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap shadow-xl border
            ${tooltip.isActive 
              ? "bg-[var(--gold)] text-[var(--black)] border-[var(--gold)]" 
              : "bg-[#1e1e1e] text-[var(--off-white)] border-[var(--dark-border)]"
            }
          `}>
            {tooltip.label}
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Top Bar */}
        <header className="lg:hidden h-14 border-b border-[var(--dark-border)] bg-[var(--dark)] flex items-center px-4 shrink-0 gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-[var(--warm-gray)] hover:text-[var(--gold)] transition-colors p-1.5 -ml-1.5 rounded-lg"
          >
            <Menu size={22} />
          </button>
          <h1 className="font-display text-base font-bold text-[var(--off-white)]">
            {TABS.find(t => t.id === activeTab)?.label}
          </h1>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto bg-[var(--black)]">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
