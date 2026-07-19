"use client";

import { Eye, Trash2 } from "lucide-react";
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
import { api } from "@/lib/api";

interface Demo {
  id: string;
  name: string;
  phone: string;
  email: string;
  school: string;
  role: string;
  students: string;
  modules: string[];
  notes: string;
  preferredDate: string;
  preferredSlot: string;
  status: "NEW" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

const STATUSES = ["NEW", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

const BADGE: Record<Demo["status"], "warning" | "default" | "success" | "secondary"> = {
  NEW: "warning",
  CONFIRMED: "default",
  COMPLETED: "success",
  CANCELLED: "secondary",
};

export default function DemosPage() {
  const [rows, setRows] = useState<Demo[]>([]);
  const [error, setError] = useState("");
  const [view, setView] = useState<Demo | null>(null);

  const load = useCallback(() => {
    api<Demo[]>("/demo-requests").then(setRows).catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  async function setStatus(row: Demo, status: Demo["status"]) {
    try {
      await api(`/demo-requests/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status } : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function remove(row: Demo) {
    if (!confirm(`Delete demo request from ${row.name}?`)) return;
    try {
      await api(`/demo-requests/${row.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Demo Requests</h1>
        <p className="text-sm text-zinc-500">
          Bookings made through the &quot;Book a Demo&quot; page.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requester</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Requested slot</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="font-medium">{row.name}</div>
                  <div className="text-xs text-zinc-500">
                    {row.email} · {row.phone}
                  </div>
                </TableCell>
                <TableCell>{row.school}</TableCell>
                <TableCell>
                  <div>{row.preferredDate || "—"}</div>
                  <div className="text-xs text-zinc-500">{row.preferredSlot}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={BADGE[row.status]}>{row.status}</Badge>
                    <Select
                      className="h-8 w-32 text-xs"
                      value={row.status}
                      onChange={(e) => setStatus(row, e.target.value as Demo["status"])}
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
                    <Button variant="ghost" size="icon" onClick={() => remove(row)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-zinc-400">
                  No demo requests yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog
        open={!!view}
        onClose={() => setView(null)}
        title={view ? `Demo request — ${view.name}` : ""}
        wide
        footer={
          view ? (
            <a href={`mailto:${view.email}`}>
              <Button>Reply by email</Button>
            </a>
          ) : undefined
        }
      >
        {view && (
          <div className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <Field label="Email" value={view.email} />
            <Field label="Phone" value={view.phone} />
            <Field label="School" value={view.school} />
            <Field label="Role" value={view.role || "—"} />
            <Field label="Students" value={view.students || "—"} />
            <Field label="Requested" value={`${view.preferredDate} · ${view.preferredSlot}`} />
            <Field label="Modules of interest" value={view.modules.join(", ") || "—"} />
            <Field
              label="Submitted"
              value={new Date(view.createdAt).toLocaleString("en-IN")}
            />
            {view.notes && (
              <div className="sm:col-span-2">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Notes
                </div>
                <p className="whitespace-pre-wrap rounded-lg bg-zinc-50 p-3">{view.notes}</p>
              </div>
            )}
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
