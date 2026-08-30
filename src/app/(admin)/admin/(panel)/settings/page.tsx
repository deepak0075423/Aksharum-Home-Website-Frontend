"use client";

import { FileCode2, Loader2, Mail, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

interface Smtp {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  notifyTo: string;
}

interface Site {
  careersOpen: boolean;
  careersClosedMessage: string;
}

interface Seo {
  sitemap: boolean;
  robots: boolean;
  llms: boolean;
}

// The three crawler-facing files, and what each one is for.
const SEO_FILES: { key: keyof Seo; path: string; blurb: string }[] = [
  {
    key: "sitemap",
    path: "/sitemap.xml",
    blurb: "Lists every public page and blog post for search engines.",
  },
  {
    key: "robots",
    path: "/robots.txt",
    blurb: "Tells crawlers what they may visit, and points to the sitemap.",
  },
  {
    key: "llms",
    path: "/llms.txt",
    blurb: "A plain-text summary of the site for AI assistants and crawlers.",
  },
];

export default function SettingsPage() {
  const [smtp, setSmtp] = useState<Smtp | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [seo, setSeo] = useState<Seo | null>(null);
  const [smtpPass, setSmtpPass] = useState("");
  const [testTo, setTestTo] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  useEffect(() => {
    api<{ smtp: Smtp; site: Site; seo: Seo }>("/settings")
      .then((s) => {
        setSmtp({ ...s.smtp, pass: "" });
        setSite(s.site);
        setSeo(s.seo);
      })
      .catch((e) => setMsg({ kind: "err", text: e.message }));
  }, []);

  function flash(kind: "ok" | "err", text: string) {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 5000);
  }

  async function saveSmtp() {
    if (!smtp) return;
    setBusy("smtp");
    try {
      await api("/settings/smtp", {
        method: "PUT",
        body: JSON.stringify({ ...smtp, pass: smtpPass, port: Number(smtp.port) }),
      });
      flash("ok", "SMTP settings saved.");
      setSmtpPass("");
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(null);
    }
  }

  async function testSmtp() {
    setBusy("test");
    try {
      const res = await api<{ message: string }>("/settings/smtp/test", {
        method: "POST",
        body: JSON.stringify({ to: testTo }),
      });
      flash("ok", res.message);
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "Test failed");
    } finally {
      setBusy(null);
    }
  }

  async function saveSite() {
    if (!site) return;
    setBusy("site");
    try {
      await api("/settings/site", { method: "PUT", body: JSON.stringify(site) });
      flash("ok", "Site settings saved.");
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(null);
    }
  }

  // Each switch saves on the spot: one toggle is a whole decision, and a
  // Save button next to three switches invites forgetting to press it.
  async function toggleSeo(key: keyof Seo, value: boolean) {
    if (!seo) return;
    const previous = seo;
    setSeo({ ...seo, [key]: value });
    setBusy(`seo-${key}`);
    try {
      await api("/settings/seo", {
        method: "PUT",
        body: JSON.stringify({ [key]: value }),
      });
      const file = SEO_FILES.find((f) => f.key === key)!;
      flash("ok", `${file.path} is now ${value ? "enabled" : "disabled"}.`);
    } catch (e) {
      setSeo(previous); // put the switch back where it was
      flash("err", e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(null);
    }
  }

  async function changePassword() {
    if (newPw !== confirmPw) {
      flash("err", "New passwords do not match.");
      return;
    }
    setBusy("pw");
    try {
      await api("/auth/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword: curPw, newPassword: newPw }),
      });
      flash("ok", "Password changed.");
      setCurPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "Change failed");
    } finally {
      setBusy(null);
    }
  }

  if (!smtp || !site || !seo) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-zinc-500">
          SMTP credentials, careers form, SEO files, and your admin account.
        </p>
      </div>

      {msg && (
        <p
          className={
            msg.kind === "ok"
              ? "rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
              : "rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          }
        >
          {msg.text}
        </p>
      )}

      {/* SMTP */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> SMTP / Email notifications
              </CardTitle>
              <CardDescription className="mt-1">
                Used to email you when someone submits a form. Works with Gmail,
                Zoho, Brevo, SES — any SMTP provider.
              </CardDescription>
            </div>
            <Switch
              checked={smtp.enabled}
              onCheckedChange={(v) => setSmtp({ ...smtp, enabled: v })}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>SMTP host</Label>
              <Input
                placeholder="smtp.gmail.com"
                value={smtp.host}
                onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Port</Label>
              <Input
                type="number"
                value={smtp.port}
                onChange={(e) => setSmtp({ ...smtp, port: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Username</Label>
              <Input
                placeholder="you@gmail.com"
                value={smtp.user}
                onChange={(e) => setSmtp({ ...smtp, user: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Password / App password</Label>
              <Input
                type="password"
                placeholder="Leave blank to keep current"
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>From name</Label>
              <Input
                value={smtp.fromName}
                onChange={(e) => setSmtp({ ...smtp, fromName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>From email</Label>
              <Input
                placeholder="no-reply@aksharum.in"
                value={smtp.fromEmail}
                onChange={(e) => setSmtp({ ...smtp, fromEmail: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Send notifications to</Label>
              <Input
                placeholder="team@aksharum.in"
                value={smtp.notifyTo}
                onChange={(e) => setSmtp({ ...smtp, notifyTo: e.target.value })}
              />
            </div>
            <div className="flex items-end gap-3 pb-0.5">
              <div className="flex items-center gap-2">
                <Switch
                  checked={smtp.secure}
                  onCheckedChange={(v) => setSmtp({ ...smtp, secure: v })}
                />
                <span className="text-sm text-zinc-600">SSL (port 465)</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
            <Button onClick={saveSmtp} disabled={busy === "smtp"}>
              {busy === "smtp" && <Loader2 className="h-4 w-4 animate-spin" />}
              Save SMTP settings
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <Input
                className="w-56"
                placeholder="you@example.com"
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={testSmtp}
                disabled={busy === "test" || !testTo}
              >
                {busy === "test" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Careers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Career applications</CardTitle>
              <CardDescription className="mt-1">
                Turn the application form on the career page on or off.
              </CardDescription>
            </div>
            <Switch
              checked={site.careersOpen}
              onCheckedChange={(v) => setSite({ ...site, careersOpen: v })}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Message shown when applications are closed</Label>
            <Textarea
              rows={2}
              value={site.careersClosedMessage}
              onChange={(e) =>
                setSite({ ...site, careersClosedMessage: e.target.value })
              }
            />
          </div>
          <Button onClick={saveSite} disabled={busy === "site"}>
            {busy === "site" && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </Button>
        </CardContent>
      </Card>

      {/* SEO files */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode2 className="h-4 w-4" /> SEO files
          </CardTitle>
          <CardDescription className="mt-1">
            Choose which crawler-facing files this site serves. A disabled file
            returns 404. These switches are stored per environment, so turning
            one off here does not affect any other deployment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {SEO_FILES.map((file) => (
            <div
              key={file.key}
              className="flex items-center justify-between gap-4 border-b border-zinc-100 py-3 last:border-0"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm font-medium">{file.path}</p>
                <p className="mt-0.5 text-sm text-zinc-500">{file.blurb}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {busy === `seo-${file.key}` && (
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                )}
                <Switch
                  checked={seo[file.key]}
                  disabled={busy === `seo-${file.key}`}
                  onCheckedChange={(v) => toggleSeo(file.key, v)}
                />
              </div>
            </div>
          ))}
          {!seo.sitemap && seo.robots && (
            <p className="pt-3 text-sm text-amber-700">
              With the sitemap off, robots.txt stops linking to it.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Change admin password</CardTitle>
          <CardDescription>
            There is no password-reset flow by design — keep this safe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Current password</Label>
              <Input
                type="password"
                value={curPw}
                onChange={(e) => setCurPw(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>New password</Label>
              <Input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm new password</Label>
              <Input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={changePassword}
            disabled={busy === "pw" || !curPw || newPw.length < 8}
          >
            {busy === "pw" && <Loader2 className="h-4 w-4 animate-spin" />}
            Change password
          </Button>
          {newPw.length > 0 && newPw.length < 8 && (
            <p className="text-xs text-amber-600">
              New password must be at least 8 characters.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
