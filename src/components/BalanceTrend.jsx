import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../data/dashboardData";
import { useTransactions } from "../context/TransactionsContext";
import { useChartTheme } from "../hooks/useChartTheme";

const VIEWS = [
  { id: "balance", label: "Balance" },
  { id: "income", label: "Income" },
  { id: "expense", label: "Expense" },
  { id: "all", label: "All" },
];

const LINE = {
  balance: { key: "balance", color: "#2563eb", darkColor: "#60a5fa", name: "Balance" },
  income: { key: "income", color: "#059669", darkColor: "#34d399", name: "Income" },
  expense: { key: "expense", color: "#e11d48", darkColor: "#fb7185", name: "Expense" },
};

function formatAxisTick(v) {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(abs % 1000 === 0 ? 0 : 1)}k`;
  return `${sign}$${abs}`;
}

function BalanceTrend() {
  const chart = useChartTheme();
  const { trendChartData } = useTransactions();
  const [view, setView] = useState("balance");

  const lines = useMemo(() => {
    if (view === "all") return [LINE.balance, LINE.income, LINE.expense];
    if (view === "balance") return [LINE.balance];
    if (view === "income") return [LINE.income];
    return [LINE.expense];
  }, [view]);

  const tickFormatter = (v) => formatAxisTick(v);

  return (
    <section
      aria-labelledby="balance-trend-heading"
      className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-[box-shadow,border-color] duration-200 ease-out hover:shadow-md dark:border-white/10 dark:bg-neutral-900/90 dark:hover:shadow-none dark:hover:ring-1 dark:hover:ring-white/10 md:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 shrink-0 sm:max-w-[55%]">
          <h2 id="balance-trend-heading" className="text-base font-semibold text-slate-900 dark:text-white">
            Balance Trend
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-neutral-400">
            Daily-style snapshot — switch series below.
          </p>
        </div>

        <div className="min-w-0 flex-1 sm:flex sm:justify-end">
          <div
            className="inline-flex w-max max-w-full flex-nowrap gap-0.5 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50/90 p-1 [-ms-overflow-style:none] [scrollbar-width:none] dark:border-neutral-700 dark:bg-neutral-950/80 sm:gap-1 [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Trend series"
          >
            {VIEWS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-pressed={view === id}
                className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold transition-[color,background-color,box-shadow] duration-150 ease-out sm:px-3 sm:text-sm ${
                  view === id
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80 dark:bg-neutral-800 dark:text-white dark:ring-white/10"
                    : "text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 h-75 w-full min-w-0 sm:h-80">
        {trendChartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 text-center text-sm text-slate-500 transition-colors duration-200 dark:border-white/10 dark:bg-neutral-950/40 dark:text-neutral-400">
            Add transactions with dates to see your balance trend.
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendChartData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={chart.gridStroke}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: chart.tickFill, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: chart.gridStroke }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: chart.tickFill, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={tickFormatter}
              width={48}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chart.tooltipBg,
                border: `1px solid ${chart.tooltipBorder}`,
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
              labelStyle={{ color: chart.tooltipLabel, fontWeight: 600 }}
              formatter={(value, name) => [formatCurrency(value), name]}
            />
            {view === "all" ? (
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: 12 }}
                formatter={(value) => <span className="text-slate-700 dark:text-neutral-300">{value}</span>}
              />
            ) : null}
            {lines.map((spec) => (
              <Line
                key={spec.key}
                type="monotone"
                dataKey={spec.key}
                name={spec.name}
                stroke={chart.dark ? spec.darkColor : spec.color}
                strokeWidth={view === "all" ? 2 : 2.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

export default BalanceTrend;
