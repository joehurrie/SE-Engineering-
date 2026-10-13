"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Wrench,
  FolderGit2,
  Newspaper,
  Mail,
  FileEdit,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Database,
} from "lucide-react";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Site Content & Copy", href: "/admin/content", icon: FileEdit },
  { name: "Elevator Products", href: "/admin/elevators", icon: Layers },
  { name: "Lift Services", href: "/admin/services", icon: Wrench },
  { name: "Projects Portfolio", href: "/admin/projects", icon: FolderGit2 },
  { name: "News & Insights", href: "/admin/news", icon: Newspaper },
  { name: "Client Inquiries", href: "/admin/inquiries", icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    let active = true;
    fetch("/api/admin/auth/me")
      .then((res) => {
        if (!res.ok) {
          if (active) {
            router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
          }
        } else {
          if (active) setCheckingAuth(false);
        }
      })
      .catch(() => {
        if (active) {
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
        }
      });

    return () => {
      active = false;
    };
  }, [pathname, router]);

  // If on login page, render full screen without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
      router.push("/admin/login");
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-[#0F172A]">
        <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-[#64748B] tracking-wide uppercase">Checking administrator access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col md:flex-row font-sans antialiased">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between px-5 py-3.5 bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
            SE
          </div>
          <span className="font-bold text-sm tracking-tight text-[#0F172A]">SE Admin CMS</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#475569] hover:text-[#0F172A] rounded-lg hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay on mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              SE
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-[#0F172A] leading-tight">
                Specialized Eng.
              </h2>
              <span className="text-[11px] text-blue-600 font-semibold">CMS Portal</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-[#475569] hover:text-[#0F172A] p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database indicator */}
        <div className="mx-4 my-3 px-3 py-2 rounded-none bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
          <Database className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span className="truncate">Neon DB Connected</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-auto shrink-0" />
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-[#475569] hover:text-[#0F172A] hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#64748B]"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom bar */}
        <div className="p-4 border-t border-[#E2E8F0] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
            <span>View Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto min-h-screen bg-[#F8FAFC]">
        <div className="admin-page-shell">{children}</div>
      </main>
    </div>
  );
}
