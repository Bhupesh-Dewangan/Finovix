import React, { useState } from "react";
import { formatCurrency } from "../data/dashboardData";
import { useFinUI } from "../context/FinUIContext";
import { useTransactions } from "../context/TransactionsContext";

const PREVIEW_COUNT = 5;

function barFillClass(index) {
  if (index === 0) return "bg-violet-500 dark:bg-violet-400";
  if (index === 1) return "bg-teal-500 dark:bg-teal-400";
  return "bg-slate-400 dark:bg-neutral-500";
}

function trackClass(dark) {
  return dark ? "bg-neutral-800" : "bg-slate-200/90";
}

function SpendingBreakdown() {
  const { theme } = useFinUI();
  const dark = theme === "dark";
  const { expenseByCategory } = useTransactions();
  const sorted = expenseByCategory;
  const top = sorted[0];
  const max = sorted[0]?.value ?? 1;

  const [expanded, setExpanded] = useState(false);
  const needsFold = sorted.length > PREVIEW_COUNT;
  const visibleList = !needsFold || expanded ? sorted : sorted.slice(0, PREVIEW_COUNT);

  return (
    <section
      aria-labelledby="spending-breakdown-heading"
      className="flex h-full min-h-0 w-full flex-col rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-[box-shadow,border-color] duration-200 ease-out hover:shadow-md dark:border-white/10 dark:bg-neutral-900/90 dark:hover:shadow-none dark:hover:ring-1 dark:hover:ring-white/10 md:p-6 lg:min-h-[26rem]"
    >
      <div className="shrink-0 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="spending-breakdown-heading" className="text-sm font-semibold text-slate-600 dark:text-neutral-400">
            Spending Breakdown
          </h2>
          <p className="text-xs text-slate-500 dark:text-neutral-500">Top categories (expenses only)</p>
        </div>
        <p className="text-sm text-slate-500 dark:text-neutral-400 sm:text-right">
          Largest:{" "}
          <span className="font-semibold text-slate-900 dark:text-white">{top ? top.name : "—"}</span>
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <p className="text-center text-sm text-slate-500 dark:text-neutral-400">
            No expense data yet. Add expenses to see a breakdown by category.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 flex min-h-0 flex-1 flex-col">
            <ul
              className={
                expanded
                  ? "min-h-0 flex-1 space-y-4 overflow-y-auto pr-1 [scrollbar-gutter:stable]"
                  : "shrink-0 space-y-4"
              }
            >
              {visibleList.map((row) => {
                const index = sorted.findIndex((r) => r.name === row.name);
                const pct = (row.value / max) * 100;
                return (
                  <li key={row.name}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-semibold text-slate-900 dark:text-white">{row.name}</span>
                      <span className="shrink-0 font-semibold tabular-nums text-slate-900 dark:text-white">
                        {formatCurrency(row.value)}
                      </span>
                    </div>
                    <div
                      className={`mt-2 h-2.5 w-full overflow-hidden rounded-full ${trackClass(dark)}`}
                      role="presentation"
                    >
                      <div
                        className={`h-full min-w-[3px] rounded-full transition-all duration-500 ${barFillClass(index)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {needsFold ? (
            <div className="mt-3 shrink-0 border-t border-slate-200 pt-3 dark:border-white/10">
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="w-full rounded-lg py-2 text-sm font-semibold text-slate-700 transition-colors duration-150 ease-out hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                aria-expanded={expanded}
              >
                {expanded ? "View less" : `View more (${sorted.length - PREVIEW_COUNT} more)`}
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

export default SpendingBreakdown;
