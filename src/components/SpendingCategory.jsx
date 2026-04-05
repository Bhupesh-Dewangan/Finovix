import React, { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import { formatCurrency } from "../data/dashboardData";
import { useChartTheme } from "../hooks/useChartTheme";
import { useTransactions } from "../context/TransactionsContext";

function DonutActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 8}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke={props.stroke}
      strokeWidth={props.strokeWidth}
    />
  );
}

function SpendingTooltip({ active, payload }, total, chart) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const value = item.value;
  const name = item.name;
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
  return (
    <div
      className="rounded-lg border px-3 py-2 text-sm shadow-lg"
      style={{
        backgroundColor: chart.tooltipBg,
        borderColor: chart.tooltipBorder,
        color: chart.tooltipLabel,
      }}
    >
      <p className="font-semibold">{name}</p>
      <p className="tabular-nums">{formatCurrency(value)}</p>
      <p className="mt-0.5 text-xs opacity-80">{pct}% of spending</p>
    </div>
  );
}

function SpendingCategory() {
  const chart = useChartTheme();
  const { expenseByCategory } = useTransactions();
  const [activeIndex, setActiveIndex] = useState(null);

  const total = useMemo(() => expenseByCategory.reduce((s, c) => s + c.value, 0), [expenseByCategory]);

  const pieData = useMemo(
    () => expenseByCategory.map((c) => ({ name: c.name, value: c.value, fill: c.pieColor })),
    [expenseByCategory],
  );

  return (
    <section
      aria-labelledby="spending-category-heading"
      className="flex h-full min-h-0 w-full flex-col rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-[box-shadow,border-color] duration-200 ease-out hover:shadow-md dark:border-white/10 dark:bg-neutral-900/90 dark:hover:shadow-none dark:hover:ring-1 dark:hover:ring-white/10 md:p-6 lg:min-h-[26rem]"
    >
      <h2 id="spending-category-heading" className="shrink-0 text-sm font-semibold text-slate-600 dark:text-neutral-400">
        Spending by Category
      </h2>

      {pieData.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <p className="text-center text-sm text-slate-500 dark:text-neutral-400">
            No expenses to chart yet. Add expense transactions to see the donut breakdown.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-3 flex min-h-0 flex-1 flex-col">
            <div className="relative min-h-[200px] w-full min-w-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="54%"
                    outerRadius="78%"
                    paddingAngle={2}
                    stroke={chart.pieSegmentStroke}
                    strokeWidth={2}
                    activeIndex={activeIndex}
                    activeShape={DonutActiveShape}
                    onMouseEnter={(_, i) => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                    isAnimationActive={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={entry.fill}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.42}
                        style={{ transition: "opacity 0.15s ease" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={(props) => SpendingTooltip(props, total, chart)}
                    cursor={{ stroke: chart.cursorStroke, strokeWidth: 1 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className="mt-3 shrink-0 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-medium sm:text-sm"
            aria-label="Category legend"
          >
            {expenseByCategory.map((c) => (
              <span key={c.name} className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: c.pieColor }} />
                <span style={{ color: c.pieColor }}>{c.name}</span>
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default SpendingCategory;
