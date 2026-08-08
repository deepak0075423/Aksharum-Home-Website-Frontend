"use client";

import {
  Briefcase,
  CalendarClock,
  ExternalLink,
  FileText,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Palette,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { api, clearToken, getToken } from "@/lib/api";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/layout-editor", label: "Branding & Layout", icon: Palette },
  { href: "/admin/blogs", label: "Blog", icon: Newspaper },
  { href: "/admin/jobs", label: "Careers / Jobs", icon: Briefcase },
  { href: "/admin/applications", label: "Applications", icon: Users },
  { href: "/admin/contacts", label: "Contact Inbox", icon: Inbox },
  { href: "/admin/demos", label: "Demo Requests", icon: CalendarClock },
  { href: "/admin/admins", label: "Admin Users", icon: ShieldCheck },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    api<{ email: string }>("/auth/me")
      .then((me) => setAdminEmail(me.email))
      .catch(() => {
        /* api() redirects on 401 */
      });
  }, [router]);

  function logout() {
    clearToken();
    router.replace("/admin/login");
  }

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-zinc-200 bg-white md:flex">
        <div className="flex items-center gap-2.5 border-b border-zinc-200 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Aksharum</div>
            <div className="text-xs text-zinc-500">Admin Panel</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-zinc-200 p-3">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100"
          >
            <ExternalLink className="h-4 w-4" />
            View website
          </a>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          {adminEmail && (
            <div className="truncate px-3 pt-1 text-xs text-zinc-400">
              {adminEmail}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center gap-1 overflow-x-auto border-b border-zinc-200 bg-white px-2 py-2 md:hidden">
        {NAV.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium",
              isActive(href) ? "bg-brand-50 text-brand-700" : "text-zinc-600",
            )}
          >
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={logout}
          className="ml-auto whitespace-nowrap rounded-lg px-3 py-1.5 text-xs text-zinc-600"
        >
          Sign out
        </button>
      </div>

      {/* Content */}
      <main className="min-w-0 flex-1 px-4 pb-10 pt-16 md:ml-60 md:px-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}
