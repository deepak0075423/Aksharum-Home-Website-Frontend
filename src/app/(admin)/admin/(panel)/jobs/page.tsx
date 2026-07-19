"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  status: "OPEN" | "FILLED" | "CLOSED";
  sortOrder: number;
  _count?: { applications: number };
}

interface SettingsShape {
  site: { careersOpen: boolean; careersClosedMessage: string };
}

const EMPTY: Omit<Job, "id" | "_count"> = {
  title: "",
  department: "",
  location: "Remote · India",
  type: "Full-time",
  description: "",
  status: "OPEN",
  sortOrder: 0,
};

const STATUS_BADGE: Record<Job["status"], "success" | "warning" | "secondary"> = {
  OPEN: "success",
  FILLED: "warning",
  CLOSED: "secondary",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [careersOpen, setCareersOpen] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Job | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api<Job[]>("/jobs/all").then(setJobs).catch((e) => setError(e.message));
    api<SettingsShape>("/settings")
      .then((s) => setCareersOpen(s.site.careersOpen))
      .catch(() => {});
  }, []);

  useEffect(load, [load]);

  async function toggleCareers(open: boolean) {
    setCareersOpen(open);
    try {
      await api("/settings/site", {
        method: "PUT",
        body: JSON.stringify({ careersOpen: open }),
      });
    } catch (e) {
      setCareersOpen(!open);
      setError(e instanceof Error ? e.message : "Failed to update");
    }
  }

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY, sortOrder: jobs.length + 1 });
    setShowForm(true);
  }

  function openEdit(job: Job) {
    setEditing(job);
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      status: job.status,
      sortOrder: job.sortOrder,
    });
    setShowForm(true);
  }

  async function saveJob() {
    setBusy(true);
    setError("");
    try {
      if (editing) {
        await api(`/jobs/${editing.id}`, { method: "PATCH", body: JSON.stringify(form) });
      } else {
        await api("/jobs", { method: "POST", body: JSON.stringify(form) });
      }
      setShowForm(false);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(job: Job, status: Job["status"]) {
    try {
      await api(`/jobs/${job.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      setJobs((js) => js.map((j) => (j.id === job.id ? { ...j, status } : j)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function remove(job: Job) {
    if (!confirm(`Delete "${job.title}"? Its applications stay in the inbox.`)) return;
    try {
      await api(`/jobs/${job.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Careers / Jobs</h1>
          <p className="text-sm text-zinc-500">
            Post roles, mark them filled, or close them. Changes go live instantly.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> Post new job
        </Button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div>
            <div className="font-medium">Accepting applications</div>
            <p className="text-sm text-zinc-500">
              When off, the application form on the career page is replaced with a
              &quot;closed&quot; notice and the API rejects submissions.
            </p>
          </div>
          <Switch checked={careersOpen} onCheckedChange={toggleCareers} />
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.department}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.type}</TableCell>
                <TableCell>{job._count?.applications ?? 0}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_BADGE[job.status]}>{job.status}</Badge>
                    <Select
                      className="h-8 w-28 text-xs"
                      value={job.status}
                      onChange={(e) => setStatus(job, e.target.value as Job["status"])}
                    >
                      <option value="OPEN">Open</option>
                      <option value="FILLED">Filled</option>
                      <option value="CLOSED">Closed</option>
                    </Select>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(job)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(job)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-zinc-400">
                  No jobs yet — post your first role.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit job" : "Post a new job"}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveJob}
              disabled={busy || !form.title.trim() || !form.department.trim()}
            >
              {editing ? "Save changes" : "Post job"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Job title</Label>
            <Input
              placeholder="e.g. Backend Engineer (NestJS)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Input
                placeholder="Engineering"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as Job["status"] })
                }
              >
                <option value="OPEN">Open</option>
                <option value="FILLED">Filled</option>
                <option value="CLOSED">Closed</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Sort order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: Number(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description (optional, shown to applicants later)</Label>
            <Textarea
              rows={4}
              placeholder="What the role involves, requirements, etc."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
