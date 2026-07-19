"use client";

import { ArrowLeft, Check, Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface CmsPage {
  slug: string;
  title: string;
  bodyHtml: string;
  cssLinks: string[];
  fontLinks: string[];
  scripts: string[];
  showLayout: boolean;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
}

// Core pages that ship with the site — deleting them would 404 real URLs
// (and 404/403 are the error pages the site falls back to).
const PROTECTED = new Set([
  "home", "about", "services", "features", "contact",
  "career", "demo", "auth", "privacy", "terms", "terms-conditions",
  "404", "403",
]);

export default function PageEditor() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const [page, setPage] = useState<CmsPage | null>(null);
  const [title, setTitle] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [showLayout, setShowLayout] = useState(true);
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [showSeo, setShowSeo] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    api<CmsPage>(`/pages/${slug}`)
      .then((p) => {
        setPage(p);
        setTitle(p.title);
        setBodyHtml(p.bodyHtml);
        setShowLayout(p.showLayout);
        setMetaDescription(p.metaDescription);
        setMetaKeywords(p.metaKeywords);
        setOgImage(p.ogImage);
      })
      .catch((e) => setError(e.message));
  }, [slug]);

  const previewDoc = useMemo(() => {
    if (!page) return "";
    const links = [...page.fontLinks, ...page.cssLinks]
      .map((h) => `<link rel="stylesheet" href="${h}">`)
      .join("\n");
    return `<!DOCTYPE html><html data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${links}</head><body>${bodyHtml}</body></html>`;
  }, [page, bodyHtml]);

  async function save() {
    setSaving(true);
    setError("");
    try {
      await api(`/pages/${slug}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          bodyHtml,
          showLayout,
          metaDescription,
          metaKeywords,
          ogImage,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete the "${slug}" page permanently? This cannot be undone.`)) return;
    try {
      await api(`/pages/${slug}`, { method: "DELETE" });
      router.push("/admin/pages");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  if (!page) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-400">
        {error ? <span className="text-red-600">{error}</span> : <Loader2 className="h-6 w-6 animate-spin" />}
      </div>
    );
  }

  const liveUrl = slug === "home" ? "/" : `/${slug}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/pages">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">Edit: {page.title}</h1>
            <a href={liveUrl} target="_blank" className="text-sm text-brand-700 hover:underline">
              {liveUrl} ↗
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!PROTECTED.has(slug) && (
            <Button variant="destructive" size="sm" onClick={remove}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          )}
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
            {saved ? "Saved" : "Save changes"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="flex flex-wrap items-end gap-6">
        <div className="flex w-full max-w-xl flex-col gap-1.5">
          <Label htmlFor="page-title">Page title (browser tab)</Label>
          <Input id="page-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 pb-1.5">
          <Switch checked={showLayout} onCheckedChange={setShowLayout} />
          <span className="text-sm text-zinc-600">Show shared header &amp; footer</span>
        </div>
      </div>
      <p className="text-xs text-zinc-400">
        The header and footer are managed once under{" "}
        <Link href="/admin/layout-editor" className="text-brand-700 hover:underline">
          Branding &amp; Layout
        </Link>{" "}
        — this page only contains its own content.
      </p>

      {/* SEO */}
      <Card>
        <button
          type="button"
          onClick={() => setShowSeo((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3.5 text-left"
        >
          <div>
            <span className="text-sm font-semibold">SEO</span>
            <span className="ml-2 text-xs text-zinc-500">
              Search description, keywords &amp; social-share image for this page
            </span>
          </div>
          <span className="text-xs text-brand-700">{showSeo ? "Hide" : "Edit"}</span>
        </button>
        {showSeo && (
          <CardContent className="space-y-4 border-t border-zinc-100 pt-4">
            <div className="space-y-1.5">
              <Label>Meta description</Label>
              <Textarea
                rows={2}
                placeholder="A short summary shown in Google results (recommended 50–160 characters)."
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
              <p
                className={
                  metaDescription.length > 160
                    ? "text-xs text-amber-600"
                    : "text-xs text-zinc-400"
                }
              >
                {metaDescription.length} characters
                {metaDescription.length > 160 && " — search engines may truncate this"}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Keywords</Label>
                <Input
                  placeholder="school erp, attendance software, fee management"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                />
                <p className="text-xs text-zinc-400">Comma-separated.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Social share image URL</Label>
                <Input
                  placeholder="https://... (shown when the link is shared on WhatsApp, X, etc.)"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex gap-1 rounded-lg bg-zinc-200/70 p-1 text-sm font-medium w-fit">
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5",
            tab === "edit" ? "bg-white shadow-sm" : "text-zinc-600",
          )}
        >
          <Pencil className="h-3.5 w-3.5" /> HTML
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5",
            tab === "preview" ? "bg-white shadow-sm" : "text-zinc-600",
          )}
        >
          <Eye className="h-3.5 w-3.5" /> Preview
        </button>
      </div>

      {tab === "edit" ? (
        <Card>
          <CardContent className="p-3">
            <Textarea
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              spellCheck={false}
              className="min-h-[65vh] resize-y border-0 font-mono text-xs leading-relaxed shadow-none focus-visible:ring-0"
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <iframe
            title="Page preview"
            srcDoc={previewDoc}
            className="h-[70vh] w-full bg-white"
            sandbox="allow-same-origin"
          />
        </Card>
      )}

      <p className="text-xs text-zinc-400">
        Tip: the preview shows content and styling only — animations and interactive
        scripts run on the live page. Save, then open {liveUrl} to see the real thing.
      </p>
    </div>
  );
}
