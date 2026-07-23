"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";
import { type ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
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
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api, apiUpload } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SocialLink {
  icon: string;
  label: string;
  url: string;
}

const PLATFORMS: { value: string; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "x", label: "X (Twitter)" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "github", label: "GitHub" },
  { value: "link", label: "Website / Other" },
];

interface LayoutData {
  headerHtml: string;
  footerHtml: string;
  social: SocialLink[];
  expandedHeaderHtml: string;
  expandedFooterHtml: string;
}

interface BrandingData {
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
}

export default function LayoutEditorPage() {
  const [layout, setLayout] = useState<LayoutData | null>(null);
  const [branding, setBranding] = useState<BrandingData | null>(null);
  const [headerHtml, setHeaderHtml] = useState("");
  const [footerHtml, setFooterHtml] = useState("");
  const [social, setSocial] = useState<SocialLink[]>([]);
  const [siteName, setSiteName] = useState("");
  const [tab, setTab] = useState<"header" | "footer" | "preview">("header");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(() => {
    api<LayoutData>("/layout")
      .then((l) => {
        setLayout(l);
        setHeaderHtml(l.headerHtml);
        setFooterHtml(l.footerHtml);
        setSocial(l.social);
      })
      .catch((e) => setMsg({ kind: "err", text: e.message }));
    api<BrandingData>("/layout/branding")
      .then((b) => {
        setBranding(b);
        setSiteName(b.siteName);
      })
      .catch(() => {});
  }, []);

  useEffect(load, [load]);

  function flash(kind: "ok" | "err", text: string) {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 5000);
  }

  async function saveBranding() {
    setBusy("branding");
    try {
      await api("/layout/branding", {
        method: "PUT",
        body: JSON.stringify({ siteName }),
      });
      flash("ok", "Branding saved — the whole site updates instantly.");
      load();
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(null);
    }
  }

  async function upload(kind: "logo" | "favicon", e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(kind);
    try {
      await apiUpload(`/layout/branding/${kind}`, file);
      flash("ok", `${kind === "logo" ? "Logo" : "Favicon"} updated.`);
      load();
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  }

  async function removeImage(kind: "logo" | "favicon") {
    setBusy(kind);
    try {
      await api(`/layout/branding/${kind}`, { method: "DELETE" });
      flash("ok", `${kind === "logo" ? "Logo reset to the default icon" : "Favicon removed"}.`);
      load();
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Remove failed");
    } finally {
      setBusy(null);
    }
  }

  async function saveSocial() {
    setBusy("social");
    try {
      await api("/layout/social", {
        method: "PUT",
        body: JSON.stringify({
          links: social.filter((l) => l.label.trim() && l.url.trim()),
        }),
      });
      flash("ok", "Social links saved — the footer updates on every page.");
      load();
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(null);
    }
  }

  function moveSocial(index: number, dir: -1 | 1) {
    setSocial((links) => {
      const next = [...links];
      const target = index + dir;
      if (target < 0 || target >= next.length) return links;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function saveLayout() {
    setBusy("layout");
    try {
      await api("/layout", {
        method: "PUT",
        body: JSON.stringify({ headerHtml, footerHtml }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      load();
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(null);
    }
  }

  const previewDoc = useMemo(() => {
    if (!layout) return "";
    return `<!DOCTYPE html><html data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap">
<link rel="stylesheet" href="/css/one.css"><link rel="stylesheet" href="/css/liquid-glass.css"></head><body>
${layout.expandedHeaderHtml}
<main style="min-height:40vh;display:flex;align-items:center;justify-content:center;color:#999;font-family:'DM Sans',sans-serif;padding:120px 20px 60px">— page content appears here —</main>
${layout.expandedFooterHtml}
</body></html>`;
  }, [layout]);

  if (!layout || !branding) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Branding &amp; Layout</h1>
        <p className="text-sm text-zinc-500">
          The header, footer, logo and favicon are shared by every page — change
          them once here.
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

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" /> Branding
          </CardTitle>
          <CardDescription>
            Site name, logo and favicon used across the whole website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex max-w-md flex-col gap-1.5">
            <Label>Site name</Label>
            <div className="flex gap-2">
              <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
              <Button onClick={saveBranding} disabled={busy === "branding" || !siteName.trim()}>
                {busy === "branding" && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
            <p className="text-xs text-zinc-500">
              Shown in the navigation, mobile menu and footer.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {(["logo", "favicon"] as const).map((kind) => {
              const url = kind === "logo" ? branding.logoUrl : branding.faviconUrl;
              return (
                <div key={kind} className="rounded-lg border border-zinc-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{kind}</span>
                    {url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(kind)}
                        disabled={busy === kind}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" /> Remove
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-zinc-100">
                      {url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={url}
                          alt={`Current ${kind}`}
                          className="max-h-10 max-w-10 object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-zinc-400">
                          {kind === "logo" ? "default" : "none"}
                        </span>
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium shadow-sm hover:bg-zinc-50">
                        {busy === kind ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        Upload {kind}
                      </span>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg,.webp,.gif,.ico"
                        className="hidden"
                        onChange={(e) => upload(kind, e)}
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    {kind === "logo"
                      ? "Replaces the graduation-cap icon in the header. Use a square image with a transparent background — it fills the badge on its own colors, so busy or non-transparent images can look cramped. Max 5MB."
                      : "The browser-tab icon. PNG or ICO, ideally 32×32 or larger. Max 5MB."}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Social links */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Social media links
              </CardTitle>
              <CardDescription className="mt-1">
                Shown in the footer&apos;s &quot;Social Media&quot; column on every
                page. Add, remove or reorder freely.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setSocial((s) => [...s, { icon: "link", label: "", url: "https://" }])
                }
              >
                <Plus className="h-4 w-4" /> Add link
              </Button>
              <Button onClick={saveSocial} disabled={busy === "social"}>
                {busy === "social" && <Loader2 className="h-4 w-4 animate-spin" />}
                Save social links
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {social.length === 0 && (
            <p className="text-sm text-zinc-400">
              No links — the social column will be empty.
            </p>
          )}
          {social.map((link, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 p-2"
            >
              <Select
                className="w-40"
                value={link.icon}
                onChange={(e) =>
                  setSocial((s) =>
                    s.map((l, j) => (j === i ? { ...l, icon: e.target.value } : l)),
                  )
                }
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
              <Input
                className="w-44 flex-1"
                placeholder="Label (e.g. Instagram)"
                value={link.label}
                onChange={(e) =>
                  setSocial((s) =>
                    s.map((l, j) => (j === i ? { ...l, label: e.target.value } : l)),
                  )
                }
              />
              <Input
                className="min-w-56 flex-[2]"
                placeholder="https://instagram.com/aksharum or mailto:hello@..."
                value={link.url}
                onChange={(e) =>
                  setSocial((s) =>
                    s.map((l, j) => (j === i ? { ...l, url: e.target.value } : l)),
                  )
                }
              />
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" onClick={() => moveSocial(i, -1)} disabled={i === 0}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveSocial(i, 1)}
                  disabled={i === social.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSocial((s) => s.filter((_, j) => j !== i))}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Header / Footer */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Shared header &amp; footer</CardTitle>
              <CardDescription className="mt-1">
                Edit once — applied to every page. New pages get them
                automatically. <code className="rounded bg-zinc-100 px-1">{"{{SITE_NAME}}"}</code>{" "}
                and <code className="rounded bg-zinc-100 px-1">{"{{LOGO_BOX}}"}</code> are
                replaced with your branding.
              </CardDescription>
            </div>
            <Button onClick={saveLayout} disabled={busy === "layout"}>
              {busy === "layout" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saved ? (
                <Check className="h-4 w-4" />
              ) : null}
              {saved ? "Saved" : "Save header & footer"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex w-fit gap-1 rounded-lg bg-zinc-200/70 p-1 text-sm font-medium">
            {(
              [
                ["header", "Header", Pencil],
                ["footer", "Footer", Pencil],
                ["preview", "Preview", Eye],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5",
                  tab === key ? "bg-white shadow-sm" : "text-zinc-600",
                )}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>

          {tab === "header" && (
            <Textarea
              value={headerHtml}
              onChange={(e) => setHeaderHtml(e.target.value)}
              spellCheck={false}
              className="min-h-[50vh] resize-y font-mono text-xs leading-relaxed"
            />
          )}
          {tab === "footer" && (
            <Textarea
              value={footerHtml}
              onChange={(e) => setFooterHtml(e.target.value)}
              spellCheck={false}
              className="min-h-[50vh] resize-y font-mono text-xs leading-relaxed"
            />
          )}
          {tab === "preview" && (
            <div className="overflow-hidden rounded-lg border border-zinc-200">
              <iframe
                title="Header and footer preview"
                srcDoc={previewDoc}
                className="h-[60vh] w-full bg-white"
                sandbox="allow-same-origin"
              />
            </div>
          )}
          <p className="text-xs text-zinc-400">
            The preview shows the saved version with a light theme. Menu links
            highlight (&quot;active&quot; state) and per-page nav styling are applied
            automatically on the live site.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
