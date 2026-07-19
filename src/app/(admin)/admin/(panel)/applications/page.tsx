"use client";

import { Download, Eye, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, apiDownload } from "@/lib/api";

interface Application {
  id: string;
  fullName: string;
  email: string;
  role: string;
  experience: string;
  company: string;
  portfolio: string;
  locations: string[];
  message: string;
  resumePath: string | null;
  resumeName: string | null;
  status: "NEW" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";
  createdAt: string;
  job?: { id: string; title: string } | null;
}

const STATUSES = ["NEW", "REVIEWED", "SHORTLISTED", "REJECTED", "HIRED"] as const;

const BADGE: Record<Application["status"], "warning" | "secondary" | "default" | "destructive" | "success"> = {
  NEW: "warning",
  REVIEWED: "secondary",
  SHORTLISTED: "default",
  REJECTED: "destructive",
  HIRED: "success",
};

export default function ApplicationsPage() {
  const [rows, setRows] = useState<Application[]>([]);
  const [error, setError] = useState("");
  const [view, setView] = useState<Application | null>(null);

  const load = useCallback(() => {
    api<Application[]>("/applications").then(setRows).catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  async function setStatus(row: Application, status: Application["status"]) {
    try {
      await api(`/applications/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status } : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function remove(row: Application) {
    if (!confirm(`Delete application from ${row.fullName}?`)) return;
    try {
      await api(`/applications/${row.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  function downloadResume(row: Application) {
    apiDownload(`/applications/${row.id}/resume`, row.resumeName ?? "resume").catch(
      (e) => setError(e.message),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Job Applications</h1>
        <p className="text-sm text-zinc-500">
          Career form submissions, newest first.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="font-medium">{row.fullName}</div>
                  <div className="text-xs text-zinc-500">{row.email}</div>
                </TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.experience}</TableCell>
                <TableCell className="text-zinc-500">
                  {new Date(row.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={BADGE[row.status]}>{row.status}</Badge>
                    <Select
                      className="h-8 w-32 text-xs"
                      value={row.status}
                      onChange={(e) =>
                        setStatus(row, e.target.value as Application["status"])
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0) + s.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </Select>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setView(row)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {row.resumePath && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => downloadResume(row)}
                        title="Download resume"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => remove(row)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-zinc-400">
                  No applications yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog
        open={!!view}
        onClose={() => setView(null)}
        title={view ? `Application — ${view.fullName}` : ""}
        wide
        footer={
          view?.resumePath ? (
            <Button onClick={() => view && downloadResume(view)}>
              <Download className="h-4 w-4" /> Download resume
            </Button>
          ) : undefined
        }
      >
        {view && (
          <div className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <Field label="Email" value={view.email} />
            <Field label="Role" value={view.role} />
            <Field label="Experience" value={view.experience} />
            <Field label="Company / College" value={view.company || "—"} />
            <Field
              label="Portfolio"
              value={
                view.portfolio ? (
                  <a
                    href={view.portfolio}
                    target="_blank"
                    className="text-brand-700 hover:underline"
                  >
                    {view.portfolio}
                  </a>
                ) : (
                  "—"
                )
              }
            />
            <Field label="Preferred locations" value={view.locations.join(", ") || "—"} />
            <Field label="Linked job" value={view.job?.title ?? "General application"} />
            <Field
              label="Applied on"
              value={new Date(view.createdAt).toLocaleString("en-IN")}
            />
            <div className="sm:col-span-2">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Why Aksharum
              </div>
              <p className="whitespace-pre-wrap rounded-lg bg-zinc-50 p-3">{view.message}</p>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="break-words">{value}</div>
    </div>
  );
}
