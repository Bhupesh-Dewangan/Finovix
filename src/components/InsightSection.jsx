import React from "react";
import { useTransactions } from "../context/TransactionsContext";

function TrendingDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 17h6v-6" />
      <path d="m22 17-8.5-8.5-5 5L2 7" />
    </svg>
  );
}

function TrendingUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </svg>
  );
}

function ChartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18" />
      <path d="m7 12 4-4 4 4 6-6" />
    </svg>
  );
}

function WalletIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

const ICONS = {
  wallet: WalletIcon,
  chart: ChartIcon,
  trendUp: TrendingUpIcon,
  trendDown: TrendingDownIcon,
};

function InsightSection() {
  const { insightCards } = useTransactions();

  return (
    <section
      aria-labelledby="insights-heading"
      className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-[box-shadow,border-color] duration-200 ease-out hover:shadow-md dark:border-white/10 dark:bg-neutral-900/90 dark:hover:shadow-none dark:hover:ring-1 dark:hover:ring-white/10 md:p-6"
    >
      <h2 id="insights-heading" className="text-base font-semibold text-slate-900 dark:text-white">
        Insights
      </h2>
      <div className="mt-5 flex flex-col divide-y divide-slate-200 dark:divide-white/10">
        {insightCards.map(({ key, icon, title, body, hint, accent }) => {
          const Icon = ICONS[icon] ?? WalletIcon;
          return (
            <article key={key} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-neutral-800 ${accent}`}
                aria-hidden
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-neutral-300">{body}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-neutral-500">{hint}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default InsightSection;
