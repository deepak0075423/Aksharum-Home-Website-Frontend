"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { Select } from "./select";

/**
 * Page numbers around the current one, with gaps collapsed:
 * 1 … 4 [5] 6 … 20. Always at most seven slots wide.
 */
function pageWindow(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const around = [page - 1, page, page + 1].filter(
    (n) => n > 1 && n < totalPages,
  );
  const shown = new Set<number>([1, ...around, totalPages]);

  const out: (number | "gap")[] = [];
  let prev = 0;
  for (const n of [...shown].sort((a, b) => a - b)) {
    if (prev && n - prev > 1) out.push("gap");
    out.push(n);
    prev = n;
  }
  return out;
}

const SIZES = [10, 25, 50];

/** Table footer: "1–10 of 84", page size, page numbers. */
export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPage,
  onLimit,
  busy,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPage: (page: number) => void;
  onLimit?: (limit: number) => void;
  busy?: boolean;
}) {
  const first = total === 0 ? 0 : (page - 1) * limit + 1;
  const last = Math.min(page * limit, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-4 py-3">
      <div className="flex items-center gap-3 text-sm text-zinc-500">
        <span>
          {first}–{last} of {total}
        </span>
        {onLimit && (
          <label className="flex items-center gap-2">
            <span className="sr-only">Rows per page</span>
            <Select
              className="h-8 w-auto py-0 text-xs"
              value={limit}
              onChange={(e) => onLimit(Number(e.target.value))}
            >
              {SIZES.map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </Select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={busy || page <= 1}
          onClick={() => onPage(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageWindow(page, totalPages).map((slot, i) =>
          slot === "gap" ? (
            <span key={`gap-${i}`} className="px-1.5 text-sm text-zinc-400">
              …
            </span>
          ) : (
            <Button
              key={slot}
              variant={slot === page ? "default" : "ghost"}
              size="sm"
              className="h-8 min-w-8 tabular-nums"
              disabled={busy}
              onClick={() => onPage(slot)}
              aria-current={slot === page ? "page" : undefined}
            >
              {slot}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={busy || page >= totalPages}
          onClick={() => onPage(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
