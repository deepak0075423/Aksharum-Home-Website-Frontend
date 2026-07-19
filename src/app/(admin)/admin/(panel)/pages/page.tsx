"use client";

import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface PageRow {
  id: string;
  slug: string;
  title: string;
  updatedAt: string;
}

const STARTER_HTML = `<section style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 20px;font-family:'DM Sans',sans-serif">
  <h1 style="font-size:42px;margin-bottom:12px">New page</h1>
  <p style="opacity:.7">Edit this content from the admin panel.</p>
</section>`;

export default function PagesListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<PageRow[]>([]);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<PageRow[]>("/pages").then(setRows).catch((e) => setError(e.message));
  }, []);

  async function createPage() {
    setBusy(true);
    setError("");
    try {
      await api("/pages", {
        method: "POST",
        body: JSON.stringify({
          slug: slug.trim(),
          title: title.trim() || slug.trim(),
          bodyHtml: STARTER_HTML,
          cssLinks: [],
          fontLinks: [],
          scripts: ["/js/site-common.js", "/js/page-transitions.js"],
          metaDescription: metaDescription.trim(),
          metaKeywords: metaKeywords.trim(),
        }),
      });
      router.push(`/admin/pages/${slug.trim()}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create page");
      setBusy(false);
    }
  }

  function urlFor(s: string) {
    return s === "home" ? "/" : `/${s}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Pages</h1>
          <p className="text-sm text-zinc-500">
            Every page of the website — edit content without touching the design.
          </p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="h-4 w-4" /> New page
        </Button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Last updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell>
                  <a
                    href={urlFor(p.slug)}
                    target="_blank"
                    className="text-brand-700 hover:underline"
                  >
                    {urlFor(p.slug)}
                  </a>
                </TableCell>
                <TableCell className="text-zinc-500">
                  {new Date(p.updatedAt).toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/pages/${p.slug}`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog
        open={showNew}
        onClose={() => setShowNew(false)}
        title="Create a new page"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowNew(false)}>
              Cancel
            </Button>
            <Button onClick={createPage} disabled={busy || !slug.trim()}>
              Create page
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-slug">URL slug</Label>
            <Input
              id="new-slug"
              placeholder="e.g. pricing"
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
              }
            />
            <p className="text-xs text-zinc-500">
              The page will be served at /{slug || "your-slug"}
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-title">Page title</Label>
            <Input
              id="new-title"
              placeholder="Pricing - Aksharum"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-desc">SEO description (optional)</Label>
            <Textarea
              id="new-desc"
              rows={2}
              placeholder="Short summary shown in Google results."
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-keys">SEO keywords (optional)</Label>
            <Input
              id="new-keys"
              placeholder="school erp, pricing"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
            />
          </div>
          <p className="text-xs text-zinc-500">
            The shared header &amp; footer are added automatically — the new page
            starts with just its own content.
          </p>
        </div>
      </Dialog>
    </div>
  );
}
