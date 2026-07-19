"use client";

import { Briefcase, CalendarClock, Inbox, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

interface Stats {
  counts: {
    pages: number;
    jobsOpen: number;
    jobsTotal: number;
    applications: number;
    applicationsNew: number;
    contacts: number;
    contactsNew: number;
    demos: number;
    demosNew: number;
  };
  recent: {
    contacts: { id: string; name: string; school: string; createdAt: string; status: string }[];
    demos: { id: string; name: string; school: string; preferredDate: string; preferredSlot: string; createdAt: string; status: string }[];
    applications: { id: string; fullName: string; role: string; createdAt: string; status: string }[];
  };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Stats>("/stats")
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  const tiles = stats
    ? [
        {
          label: "Contact messages",
          value: stats.counts.contacts,
          badge: stats.counts.contactsNew,
          icon: Inbox,
          href: "/admin/contacts",
        },
        {
          label: "Demo requests",
          value: stats.counts.demos,
          badge: stats.counts.demosNew,
          icon: CalendarClock,
          href: "/admin/demos",
        },
        {
          label: "Job applications",
          value: stats.counts.applications,
          badge: stats.counts.applicationsNew,
          icon: Users,
          href: "/admin/applications",
        },
        {
          label: "Open roles",
          value: stats.counts.jobsOpen,
          badge: 0,
          icon: Briefcase,
          href: "/admin/jobs",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          What&apos;s happening across your website.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <t.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-semibold">{t.value}</span>
                    {t.badge > 0 && <Badge>{t.badge} new</Badge>}
                  </div>
                  <div className="truncate text-sm text-zinc-500">{t.label}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {stats && (
        <div className="grid gap-4 xl:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent contact messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.recent.contacts.length === 0 && (
                <p className="text-sm text-zinc-400">Nothing yet.</p>
              )}
              {stats.recent.contacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{c.name}</div>
                    <div className="truncate text-xs text-zinc-500">{c.school}</div>
                  </div>
                  <div className="text-right text-xs text-zinc-400">
                    {fmtDate(c.createdAt)}
                    {c.status === "NEW" && (
                      <Badge className="ml-2" variant="warning">new</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent demo requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.recent.demos.length === 0 && (
                <p className="text-sm text-zinc-400">Nothing yet.</p>
              )}
              {stats.recent.demos.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{d.name}</div>
                    <div className="truncate text-xs text-zinc-500">
                      {d.school} · {d.preferredDate} {d.preferredSlot}
                    </div>
                  </div>
                  <div className="text-right text-xs text-zinc-400">
                    {fmtDate(d.createdAt)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.recent.applications.length === 0 && (
                <p className="text-sm text-zinc-400">Nothing yet.</p>
              )}
              {stats.recent.applications.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{a.fullName}</div>
                    <div className="truncate text-xs text-zinc-500">{a.role}</div>
                  </div>
                  <div className="text-right text-xs text-zinc-400">
                    {fmtDate(a.createdAt)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
