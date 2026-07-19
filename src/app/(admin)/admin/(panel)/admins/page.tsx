"use client";

import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";

interface Admin {
  id: string;
  email: string;
  name: string;
  isRoot: boolean;
  active: boolean;
  createdAt: string;
}

export default function AdminsPage() {
  const [rows, setRows] = useState<Admin[]>([]);
  const [me, setMe] = useState<Admin | null>(null);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api<Admin[]>("/auth/admins").then(setRows).catch((e) => setError(e.message));
    api<Admin>("/auth/me").then(setMe).catch(() => {});
  }, []);

  useEffect(load, [load]);

  async function createAdmin() {
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api("/auth/admins", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      setShowNew(false);
      setForm({ name: "", email: "", password: "", confirm: "" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create admin");
    } finally {
      setBusy(false);
    }
  }

  async function setActive(row: Admin, active: boolean) {
    try {
      await api(`/auth/admins/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active }),
      });
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, active } : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function remove(row: Admin) {
    if (!confirm(`Delete admin ${row.email} permanently?`)) return;
    try {
      await api(`/auth/admins/${row.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const isRoot = me?.isRoot === true;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Admin Users</h1>
          <p className="text-sm text-zinc-500">
            Anyone here can sign in at /admin/login and manage the website.
          </p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="h-4 w-4" /> Add admin
        </Button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {!isRoot && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Only the primary admin can deactivate or delete accounts. You can add new
          admins.
        </p>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Added</TableHead>
              <TableHead>Status</TableHead>
              {isRoot && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="flex items-center gap-2 font-medium">
                    {row.name}
                    {row.isRoot && (
                      <Badge className="gap-1">
                        <ShieldCheck className="h-3 w-3" /> Primary
                      </Badge>
                    )}
                    {me?.id === row.id && <Badge variant="outline">You</Badge>}
                  </div>
                  <div className="text-xs text-zinc-500">{row.email}</div>
                </TableCell>
                <TableCell className="text-zinc-500">
                  {new Date(row.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={row.active ? "success" : "secondary"}>
                    {row.active ? "Active" : "Deactivated"}
                  </Badge>
                </TableCell>
                {isRoot && (
                  <TableCell className="text-right">
                    {row.isRoot ? (
                      <span className="text-xs text-zinc-400">
                        Cannot be modified
                      </span>
                    ) : (
                      <div className="flex items-center justify-end gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">Active</span>
                          <Switch
                            checked={row.active}
                            onCheckedChange={(v) => setActive(row, v)}
                          />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => remove(row)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog
        open={showNew}
        onClose={() => setShowNew(false)}
        title="Add a new admin"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowNew(false)}>
              Cancel
            </Button>
            <Button
              onClick={createAdmin}
              disabled={busy || !form.email || form.password.length < 8}
            >
              Create admin
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="person@aksharum.in"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Min 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm password</Label>
              <Input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            New admins can manage everything on the site and add other admins, but
            only the primary admin can deactivate or delete accounts.
          </p>
        </div>
      </Dialog>
    </div>
  );
}
