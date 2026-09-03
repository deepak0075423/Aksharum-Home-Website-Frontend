"use client";

import { Check, ChevronDown, Plus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

/**
 * Searchable tag multi-select.
 *
 * Replaces a free-text "comma-separated" field: existing tags are searched
 * and ticked rather than retyped — which is what kept spawning near-duplicate
 * tags ("School ERP" vs "school erp") — while a genuinely new tag can still
 * be coined from the search box.
 */
export function TagSelect({
  value,
  options,
  onChange,
  max = 12,
  loading,
}: {
  value: string[];
  options: { tag: string; count: number }[];
  onChange: (tags: string[]) => void;
  max?: number;
  loading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const needle = query.trim();

  const matches = useMemo(() => {
    const lower = needle.toLowerCase();
    const found = lower
      ? options.filter((o) => o.tag.toLowerCase().includes(lower))
      : options;
    // Ticked tags first, so they stay reachable in a long catalogue.
    return [...found].sort(
      (a, b) => Number(value.includes(b.tag)) - Number(value.includes(a.tag)),
    );
  }, [options, needle, value]);

  // Offer to coin a tag only when nothing already matches it exactly.
  const canCreate =
    needle.length > 0 &&
    !options.some((o) => o.tag.toLowerCase() === needle.toLowerCase()) &&
    !value.some((t) => t.toLowerCase() === needle.toLowerCase());

  const full = value.length >= max;

  function toggle(tag: string) {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else if (!full) {
      onChange([...value, tag]);
    }
  }

  function create() {
    if (!canCreate || full) return;
    onChange([...value, needle]);
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="relative" ref={boxRef}>
      {/* The control shows what is selected; the catalogue stays folded away
          so a hundred tags never push the form off screen. A div rather than
          a button — the chips carry their own remove buttons. */}
      <div
        role="combobox"
        tabIndex={0}
        aria-expanded={open}
        aria-controls="tag-select-list"
        aria-label="Tags"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className={cn(
          "flex min-h-9 w-full cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-left text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          open && "ring-2 ring-brand-500",
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1">
          {value.length === 0 ? (
            <span className="text-zinc-400">Search and pick tags…</span>
          ) : (
            value.map((tag) => (
              <Badge key={tag} className="gap-1 pr-1">
                {tag}
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  className="rounded-full p-0.5 hover:bg-brand-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(value.filter((t) => t !== tag));
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-zinc-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </div>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg">
          <div className="border-b border-zinc-200 p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  create();
                } else if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
              placeholder={
                loading ? "Loading tags…" : `Search ${options.length} tags…`
              }
              className="h-8 w-full rounded-md border border-zinc-200 px-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            />
          </div>

          <div
            id="tag-select-list"
            className="max-h-56 overflow-y-auto p-1"
            role="listbox"
            aria-multiselectable
          >
            {canCreate && (
              <button
                type="button"
                onClick={create}
                disabled={full}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-brand-700 hover:bg-brand-50 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Create “{needle}”
              </button>
            )}

            {matches.length === 0 && !canCreate ? (
              <p className="px-2.5 py-4 text-center text-sm text-zinc-500">
                {loading ? "Loading tags…" : "No tags yet — type to create one."}
              </p>
            ) : (
              matches.map(({ tag, count }) => {
                const on = value.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    role="option"
                    aria-selected={on}
                    disabled={!on && full}
                    onClick={() => toggle(tag)}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-zinc-100 disabled:opacity-40"
                  >
                    <span
                      className={cn(
                        "grid h-4 w-4 shrink-0 place-items-center rounded border",
                        on
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-zinc-300",
                      )}
                    >
                      {on && <Check className="h-3 w-3" />}
                    </span>
                    <span className="flex-1 truncate">{tag}</span>
                    <span className="text-xs tabular-nums text-zinc-400">
                      {count}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      <p className="mt-1 text-xs text-zinc-500">
        {full
          ? `Tag limit reached (${max}).`
          : `${value.length}/${max} tags — search to reuse an existing one, or press Enter to create.`}
      </p>
    </div>
  );
}
