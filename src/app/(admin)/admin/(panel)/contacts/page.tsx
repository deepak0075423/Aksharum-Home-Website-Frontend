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

interface Contact {
  id: string;
  name: string;
  email: string;
  school: string;
  phone: string;
  role: string;
  students: string;
  moduleInterest: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: string;
}

const STATUSES = ["NEW", "READ", "REPLIED", "ARCHIVED"] as const;

const BADGE: Record<Contact["status"], "warning" | "secondary" | "success" | "outline"> = {
  NEW: "warning",
  READ: "secondary",
  REPLIED: "success",
  ARCHIVED: "outline",
};

export default function ContactsPage() {
  const [rows, setRows] = useState<Contact[]>([]);
  const [error, setError] = useState("");
  const [view, setView] = useState<Contact | null>(null);

  const load = useCallback(() => {
    api<Contact[]>("/contact").then(setRows).catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  async function setStatus(row: Contact, status: Contact["status"]) {
    try {
      await api(`/contact/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status } : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function remove(row: Contact) {
    if (!confirm(`Delete message from ${row.name}?`)) return;
    try {
      await api(`/contact/${row.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  function openView(row: Contact) {
    setView(row);
    if (row.status === "NEW") setStatus(row, "READ");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Contact Inbox</h1>
        <p className="text-sm text-zinc-500">
          Messages from the contact form, newest first.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="font-medium">{row.name}</div>
                  <div className="text-xs text-zinc-500">{row.email}</div>
                </TableCell>
                <TableCell>{row.school}</TableCell>
                <TableCell>{row.phone || "—"}</TableCell>
                <TableCell className="text-zinc-500">
                  {new Date(row.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={BADGE[row.status]}>{row.status}</Badge>
                    <Select
                      className="h-8 w-28 text-xs"
                      value={row.status}
                      onChange={(e) => setStatus(row, e.target.value as Contact["status"])}
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
                    <Button variant="ghost" size="icon" onClick={() => openView(row)}>
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
                <TableCell colSpan={6} className="py-8 text-center text-zinc-400">
                  No messages yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog
        open={!!view}
        onClose={() => setView(null)}
        title={view ? `Message from ${view.name}` : ""}
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
            <Field label="Phone" value={view.phone || "—"} />
            <Field label="School / Organisation" value={view.school} />
            <Field label="Role" value={view.role || "—"} />
            <Field label="No. of students" value={view.students || "—"} />
            <Field label="Module interest" value={view.moduleInterest || "—"} />
            <div className="sm:col-span-2">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Message
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
