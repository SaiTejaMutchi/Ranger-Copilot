import { Link, useLocation } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "@/lib/utils";
const navItems = [
  { to: "/upload", label: "AI Triage", icon: "⬡", isOverview: true, badge: undefined as number | undefined, locked: false },
  { to: "#", label: "Live Surveillance", icon: "◎", isOverview: false, badge: undefined as number | undefined, locked: true },
  { to: "/review", label: "Audit Trail", icon: "⊡", isOverview: false, badge: undefined as number | undefined, locked: false },
  { to: "/briefs", label: "Incident Reports", icon: "⊟", isOverview: false, badge: undefined as number | undefined, locked: false },
];

const settingsItems = [
  { to: "/config", label: "System Controls", icon: "◧" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const batches = useQuery(api.batches.listBatches, { limit: 50 });
  const reviewCount = batches?.filter((b) => b.status === "completed").length ?? 0;

  const itemsWithBadge = navItems.map((item) =>
    item.to === "/review" && reviewCount > 0 ? { ...item, badge: reviewCount } : item
  );

  const isActive = (to: string, isOverview?: boolean) => {
    if (location.pathname === to) return true;
    if (isOverview && (location.pathname === "/upload" || location.pathname.startsWith("/results/"))) return true;
    return false;
  };

  const LockIcon = () => (
    <span className="w-[18px] text-center text-[10px] opacity-60" aria-hidden title="Locked">🔒</span>
  );

  return (
    <div className="flex min-h-screen bg-[#080909] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-[220px] min-h-screen bg-[#0c0d0e] border-r border-white/[0.06] flex flex-col shrink-0 fixed top-0 left-0 bottom-0 z-50">
        <Link
          to="/upload"
          className="flex items-center gap-[9px] px-[18px] py-5 border-b border-white/[0.06] no-underline text-white"
        >
          <div className="w-7 h-7 bg-white rounded-[7px] flex items-center justify-center text-sm shrink-0">🛡</div>
          <span className="text-[14.5px] font-bold tracking-[-0.3px]">ShieldDispatch</span>
        </Link>

        <nav className="flex-1 py-3.5 px-2.5 flex flex-col gap-px overflow-y-auto">
          {itemsWithBadge.map(({ to, label, icon, badge, isOverview, locked }) =>
            locked ? (
              <div
                key={label}
                className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-[13.5px] font-medium text-white/25 cursor-not-allowed opacity-70"
                aria-disabled="true"
              >
                <span className="w-[18px] text-center text-sm opacity-50">{icon}</span>
                <span className="flex-1">{label}</span>
                <LockIcon />
              </div>
            ) : (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-[13.5px] font-medium transition-all no-underline",
                  isActive(to, isOverview)
                    ? "bg-white/[0.07] text-white"
                    : "text-white/40 hover:bg-white/[0.05] hover:text-white/80"
                )}
              >
                <span className="w-[18px] text-center text-sm opacity-70">{icon}</span>
                <span className="flex-1">{label}</span>
                {to === "/upload" && isActive(to, true) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
                {badge !== undefined && (
                  <span className="bg-white/10 rounded-full font-mono text-[10px] px-[7px] py-0.5 text-white/50">
                    {badge}
                  </span>
                )}
              </Link>
            )
          )}

          <div className="font-mono text-[9.5px] tracking-widest text-white/20 uppercase pt-6 px-2.5 pb-1.5">
            Settings
          </div>
          {settingsItems.map(({ to, label, icon }) => (
            <Link
              key={label}
              to={to}
              className={cn(
                "flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-[13.5px] font-medium transition-all no-underline",
                location.pathname === to
                  ? "bg-white/[0.07] text-white"
                  : "text-white/40 hover:bg-white/[0.05] hover:text-white/80"
              )}
            >
              <span className="w-[18px] text-center text-sm opacity-70">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3.5 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-white/[0.05]">
            <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] flex items-center justify-center text-[13px] shrink-0">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold text-white/80 truncate">Lead Officer</div>
              <div className="text-[11px] text-white/30 mt-0.5">U.S. Southwest</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden ml-[220px]">
        {children}
      </main>
    </div>
  );
}
