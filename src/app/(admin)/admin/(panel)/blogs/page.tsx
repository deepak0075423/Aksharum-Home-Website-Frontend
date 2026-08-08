"use client";

import { ExternalLink, ImageOff, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import RichEditor from "@/components/rich-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { api, apiUpload } from "@/lib/api";

interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyHtml: string;
  status: "DRAFT" | "PUBLISHED";
  coverPath: string;
  coverAlt: string;
  author: string;
  tags: string[];
  publishedAt: string | null;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  createdAt: string;
}

type Form = Omit<Blog, "id" | "publishedAt" | "createdAt"> & { tagsText: string };

const EMPTY: Form = {
  slug: "",
  title: "",
  excerpt: "",
  bodyHtml: "",
  status: "DRAFT",
  coverPath: "",
  coverAlt: "",
  author: "Aksharum",
  tags: [],
  tagsText: "",
  metaDescription: "",
  metaKeywords: "",
  ogImage: "",
};

/** "Fee Collection in 2026!" -> "fee-collection-in-2026" */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Blog | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  // Blank once the admin edits the slug by hand, so we stop overwriting it.
  const [slugLocked, setSlugLocked] = useState(false);

  const load = useCallback(() => {
    api<Blog[]>("/blogs/all")
      .then(setBlogs)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setSlugLocked(false);
    setError("");
    setShowForm(true);
  }

  function openEdit(blog: Blog) {
    setEditing(blog);
    setForm({ ...blog, tagsText: blog.tags.join(", ") });
    setSlugLocked(true);
    setError("");
    setShowForm(true);
  }

  function setTitle(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: slugLocked ? f.slug : slugify(title),
    }));
  }

  async function uploadCover(file: File) {
    setUploading(true);
    setError("");
    try {
      const { coverPath } = await apiUpload<{ coverPath: string }>(
        "/blogs/cover",
        file,
      );
      setForm((f) => ({ ...f, coverPath }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setBusy(true);
    setError("");

    const tags = form.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      bodyHtml: form.bodyHtml,
      status: form.status,
      coverPath: form.coverPath,
      coverAlt: form.coverAlt,
      author: form.author,
      tags,
      metaDescription: form.metaDescription,
      metaKeywords: form.metaKeywords,
      ogImage: form.ogImage,
    };

    try {
      if (editing) {
        await api(`/blogs/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/blogs", { method: "POST", body: JSON.stringify(payload) });
      }
      setShowForm(false);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(blog: Blog) {
    if (!window.confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;
    try {
      await api(`/blogs/${blog.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const coverPreview = form.coverPath
    ? `/api/blogs/cover/${encodeURIComponent(form.coverPath)}`
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
          <p className="text-sm text-zinc-500">
            Posts published here appear at /blogs and in the sitemap.
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/blogs" target="_blank" rel="noopener">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4" />
              View blog
            </Button>
          </a>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" />
            New post
          </Button>
        </div>
      </div>

      {error && !showForm && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-zinc-500">
                    No posts yet. Create your first one.
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {blog.coverPath ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/api/blogs/cover/${encodeURIComponent(blog.coverPath)}`}
                            alt=""
                            className="h-10 w-16 shrink-0 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded bg-gradient-to-br from-brand-600 to-brand-400 text-white">
                            <ImageOff className="h-4 w-4 opacity-80" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="truncate font-medium">{blog.title}</div>
                          <div className="truncate text-xs text-zinc-500">
                            /blogs/{blog.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-zinc-600">
                      {blog.author}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={blog.status === "PUBLISHED" ? "success" : "secondary"}
                      >
                        {blog.status === "PUBLISHED" ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(blog)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(blog)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit post" : "New post"}
        wide
        footer={
          <>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={busy || !form.title || !form.slug}>
              {busy ? "Saving…" : "Save post"}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="How schools cut fee-collection time in half"
              />
            </div>

            <div>
              <Label htmlFor="slug">URL slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugLocked(true);
                  setForm((f) => ({ ...f, slug: e.target.value }));
                }}
                placeholder="fee-collection-time"
              />
              <p className="mt-1 text-xs text-zinc-500">/blogs/{form.slug || "…"}</p>
            </div>

            <div>
              <Label htmlFor="author">Created by</Label>
              <Input
                id="author"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Aksharum"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={form.tagsText}
                onChange={(e) => setForm((f) => ({ ...f, tagsText: e.target.value }))}
                placeholder="Fees, Admissions, Product"
              />
              <p className="mt-1 text-xs text-zinc-500">Comma-separated</p>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as Blog["status"] }))
                }
              >
                <option value="DRAFT">Draft — hidden from the site</option>
                <option value="PUBLISHED">Published — live at /blogs</option>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="One or two lines shown on the listing card and used as the meta description fallback."
              />
            </div>
          </div>

          {/* ── Cover image ── */}
          <div className="rounded-lg border border-zinc-200 p-4">
            <Label>Cover image</Label>
            <p className="mb-3 text-xs text-zinc-500">
              Optional — posts without one show a brand gradient tile, so the
              listing grid stays even either way.
            </p>
            <div className="flex flex-wrap items-start gap-4">
              {coverPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverPreview}
                  alt=""
                  className="h-24 w-40 rounded-lg border border-zinc-200 object-cover"
                />
              ) : (
                <div className="flex h-24 w-40 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 text-white">
                  <ImageOff className="h-6 w-6 opacity-80" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadCover(file);
                      e.target.value = "";
                    }}
                  />
                  <span className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium shadow-sm hover:bg-zinc-50">
                    <Upload className="h-4 w-4" />
                    {uploading ? "Uploading…" : "Upload image"}
                  </span>
                </label>
                {form.coverPath && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setForm((f) => ({ ...f, coverPath: "" }))}
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
              <div className="min-w-[200px] flex-1">
                <Label htmlFor="coverAlt">Alt text</Label>
                <Input
                  id="coverAlt"
                  value={form.coverAlt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, coverAlt: e.target.value }))
                  }
                  placeholder="Describes the image for screen readers"
                />
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div>
            <Label>Content</Label>
            <RichEditor
              value={form.bodyHtml}
              onChange={(html) => setForm((f) => ({ ...f, bodyHtml: html }))}
            />
          </div>

          {/* ── SEO ── */}
          <div className="rounded-lg border border-zinc-200 p-4">
            <Label>SEO</Label>
            <p className="mb-3 text-xs text-zinc-500">
              Leave blank to fall back to the excerpt, tags and cover image.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="metaDescription">Meta description</Label>
                <Textarea
                  id="metaDescription"
                  rows={2}
                  value={form.metaDescription}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, metaDescription: e.target.value }))
                  }
                  placeholder="Shown in search results — aim for 150-160 characters."
                />
                <p className="mt-1 text-xs text-zinc-500">
                  {(form.metaDescription || form.excerpt).length} characters
                </p>
              </div>
              <div>
                <Label htmlFor="metaKeywords">Meta keywords</Label>
                <Input
                  id="metaKeywords"
                  value={form.metaKeywords}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, metaKeywords: e.target.value }))
                  }
                  placeholder="school fees, fee collection"
                />
              </div>
              <div>
                <Label htmlFor="ogImage">Social share image URL</Label>
                <Input
                  id="ogImage"
                  value={form.ogImage}
                  onChange={(e) => setForm((f) => ({ ...f, ogImage: e.target.value }))}
                  placeholder="Defaults to the cover image"
                />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
