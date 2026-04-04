import React from "react";
// ----

function CreditCardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function TrendUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </svg>
  );
}

function TrendDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 17h6v-6" />
      <path d="m22 17-8.5-8.5-5 5L2 7" />
    </svg>
  );
}

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function SummarySection() {
  const { summary } = useTransactions();
  const { totalBalance, totalIncome, totalExpense, balanceSubtitle } = summary;

  const cards = [
    {
      label: "Total Balance",
      value: totalBalance,
      tone: totalBalance >= 0 ? "positive" : "negative",
      subtitle: balanceSubtitle,
      Icon: CreditCardIcon,
    },
    {
      label: "Income",
      value: totalIncome,
      tone: "positive",
      subtitle: "Total money received",
      Icon: TrendUpIcon,
    },
    {
      label: "Expenses",
      value: totalExpense,
      tone: "negative",
      subtitle: "Total money spent",
      Icon: TrendDownIcon,
    },
  ];

  return (
    <section aria-label="Account summary" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map(({ label, value, tone, subtitle, Icon }) => (
        <article
          key={label}
          className="relative rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-[box-shadow,border-color] duration-200 ease-out hover:shadow-md dark:border-white/10 dark:bg-neutral-900/90 dark:hover:shadow-none dark:hover:ring-1 dark:hover:ring-white/10"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-slate-600 dark:text-neutral-400">{label}</p>
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-200"
              aria-hidden
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <p
            className={
              tone === "positive"
                ? "mt-3 text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400"
                : "mt-3 text-2xl font-semibold tracking-tight text-rose-600 dark:text-rose-400"
            }
          >
            {formatMoney(value)}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-neutral-500">{subtitle}</p>
        </article>
      ))}
    </section>
  );
}

export default SummarySection;
