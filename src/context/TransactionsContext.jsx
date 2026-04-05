

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "finovix_transactions";

const CATEGORY_PALETTE = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#dc2626",
  "#ea580c",
  "#16a34a",
  "#0d9488",
  "#0891b2",
  "#ca8a04",
];

export const SEED_TRANSACTIONS = [
  {
    id: "1",
    date: "2026-04-03",
    category: "Coffee",
    type: "expense",
    amount: 4.5,
  },
  {
    id: "2",
    date: "2026-04-02",
    category: "Groceries",
    type: "expense",
    amount: 120.5,
  },
  {
    id: "3",
    date: "2026-04-01",
    category: "Salary",
    type: "income",
    amount: 3200,
  },
  {
    id: "4",
    date: "2026-03-30",
    category: "Utilities",
    type: "expense",
    amount: 89.99,
  },
  {
    id: "5",
    date: "2026-03-28",
    category: "Freelance",
    type: "income",
    amount: 450,
  },
  {
    id: "6",
    date: "2026-03-25",
    category: "Dining",
    type: "expense",
    amount: 64.25,
  },
  {
    id: "7",
    date: "2026-03-22",
    category: "Transport",
    type: "expense",
    amount: 35,
  },
  {
    id: "8",
    date: "2026-03-18",
    category: "Rent",
    type: "expense",
    amount: 1650,
  },
  {
    id: "9",
    date: "2026-03-10",
    category: "Gym",
    type: "expense",
    amount: 49.99,
  },
  {
    id: "10",
    date: "2026-03-05",
    category: "Interest",
    type: "income",
    amount: 12.4,
  },
  {
    id: "11",
    date: "2026-02-27",
    category: "Groceries",
    type: "expense",
    amount: 98.2,
  },
  {
    id: "12",
    date: "2026-02-14",
    category: "Gifts",
    type: "expense",
    amount: 75,
  },
  {
    id: "13",
    date: "2026-02-01",
    category: "Salary",
    type: "income",
    amount: 3200,
  },
  {
    id: "14",
    date: "2026-01-20",
    category: "Healthcare",
    type: "expense",
    amount: 120,
  },
  {
    id: "15",
    date: "2026-01-08",
    category: "Utilities",
    type: "expense",
    amount: 72.5,
  },
  {
    id: "16",
    date: "2025-12-15",
    category: "Holiday",
    type: "expense",
    amount: 240,
  },
];

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `t-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isValidTransaction(t) {
  return (
    t &&
    typeof t.id === "string" &&
    typeof t.date === "string" &&
    typeof t.category === "string" &&
    (t.type === "income" || t.type === "expense") &&
    typeof t.amount === "number" &&
    !Number.isNaN(t.amount)
  );
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || !data.every(isValidTransaction)) return null;
    return data;
  } catch {
    return null;
  }
}

function formatInsightCurrency(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function computeSummary(transactions) {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }
  const balance = income - expense;
  const balanceSubtitle =
    income === 0 && expense === 0
      ? "Add transactions to track"
      : balance >= 0
        ? "Income exceeds expenses"
        : "Expenses exceed income";
  return {
    totalIncome: income,
    totalExpense: expense,
    totalBalance: balance,
    balanceSubtitle,
  };
}

function computeExpenseCategories(transactions) {
  const map = new Map();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const key = (t.category || "").trim() || "Uncategorized";
    map.set(key, (map.get(key) || 0) + t.amount);
  }
  const rows = [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  return rows.map((row, i) => ({
    ...row,
    pieColor: CATEGORY_PALETTE[i % CATEGORY_PALETTE.length],
  }));
}

function formatDayLabel(iso) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const MAX_TREND_POINTS = 32;

function computeTrend(transactions) {
  const byDay = new Map();
  for (const t of transactions) {
    const d = t.date;
    if (!d) continue;
    if (!byDay.has(d)) byDay.set(d, { income: 0, expense: 0 });
    const b = byDay.get(d);
    if (t.type === "income") b.income += t.amount;
    else b.expense += t.amount;
  }
  const dates = [...byDay.keys()].sort();
  let running = 0;
  const full = dates.map((dateStr) => {
    const { income, expense } = byDay.get(dateStr);
    running += income - expense;
    return {
      label: formatDayLabel(dateStr),
      sortKey: dateStr,
      balance: Math.round(running * 100) / 100,
      income: Math.round(income * 100) / 100,
      expense: Math.round(expense * 100) / 100,
    };
  });
  if (full.length === 0) return [];
  if (full.length <= MAX_TREND_POINTS) return full;
  return full.slice(-MAX_TREND_POINTS);
}

function computeMonthlyComparison(transactions) {
  const expenseOnly = transactions.filter((t) => t.type === "expense");
  const dates = expenseOnly
    .map((t) => t.date)
    .filter(Boolean)
    .sort();
  const anchor = dates.length
    ? dates[dates.length - 1]
    : new Date().toISOString().slice(0, 10);
  const [y, m] = anchor.split("-").map(Number);
  const currentYm = `${y}-${String(m).padStart(2, "0")}`;
  const prevMonth = m === 1 ? 12 : m - 1;
  const prevYear = m === 1 ? y - 1 : y;
  const prevYm = `${prevYear}-${String(prevMonth).padStart(2, "0")}`;

  const sumInYm = (ym) =>
    expenseOnly
      .filter((t) => t.date.startsWith(ym))
      .reduce((s, t) => s + t.amount, 0);

  const currentSpend = sumInYm(currentYm);
  const previousSpend = sumInYm(prevYm);

  const currentLabel = new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const previousLabel = new Date(prevYear, prevMonth - 1, 1).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  return { currentLabel, previousLabel, currentSpend, previousSpend };
}

function computeInsightCards(trendData, expenseCategories, monthly) {
  const cards = [];
  const { currentLabel, previousLabel, currentSpend, previousSpend } = monthly;

  if (expenseCategories.length > 0) {
    const top = expenseCategories[0];
    const total = expenseCategories.reduce((s, c) => s + c.value, 0);
    const topPct = total > 0 ? Math.round((top.value / total) * 100) : 0;
    cards.push({
      key: "top",
      icon: "wallet",
      title: "Highest spending category",
      body: `${top.name} leads your expenses at ${formatInsightCurrency(top.value)}.`,
      hint: `About ${topPct}% of tracked spending in this period.`,
      accent: "text-violet-600 dark:text-violet-400",
    });
  } else {
    cards.push({
      key: "top",
      icon: "wallet",
      title: "Highest spending category",
      body: "No expense transactions yet.",
      hint: "Add an expense to see which category dominates.",
      accent: "text-violet-600 dark:text-violet-400",
    });
  }

  const deltaPct =
    previousSpend > 0
      ? ((currentSpend - previousSpend) / previousSpend) * 100
      : currentSpend > 0
        ? 100
        : 0;
  const deltaRounded = Math.round(deltaPct * 10) / 10;
  const spendingDown = deltaRounded < 0;
  const noMonthData = previousSpend === 0 && currentSpend === 0;

  cards.push({
    key: "month",
    icon: "chart",
    title: "Monthly comparison",
    body: noMonthData
      ? `No expenses recorded for ${currentLabel} or ${previousLabel} yet.`
      : `${currentLabel} spending is ${formatInsightCurrency(currentSpend)} vs ${formatInsightCurrency(previousSpend)} in ${previousLabel}.`,
    hint: noMonthData
      ? "Add expenses to compare months."
      : previousSpend === 0
        ? `No spending in ${previousLabel} to compare against.`
        : `${spendingDown ? "Down" : "Up"} ${Math.abs(deltaRounded)}% period over period.`,
    accent: noMonthData
      ? "text-slate-500 dark:text-neutral-500"
      : spendingDown
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-amber-600 dark:text-amber-400",
  });

  if (trendData.length >= 2) {
    const balanceStart = trendData[0].balance;
    const balanceEnd = trendData[trendData.length - 1].balance;
    const balanceChange = balanceEnd - balanceStart;
    const balanceUp = balanceChange >= 0;
    const avgExpense =
      trendData.reduce((s, d) => s + d.expense, 0) / trendData.length;
    const lastExpense = trendData[trendData.length - 1].expense;
    const expenseVsAvg = avgExpense > 0 && lastExpense > avgExpense * 1.08;
    cards.push({
      key: "trend",
      icon: balanceUp ? "trendUp" : "trendDown",
      title: "Quick read on the data",
      body: balanceUp
        ? `Running balance rose ${formatInsightCurrency(balanceChange)} from ${trendData[0].label} through ${trendData[trendData.length - 1].label}.`
        : `Running balance fell ${formatInsightCurrency(Math.abs(balanceChange))} over the same window.`,
      hint: expenseVsAvg
        ? "Latest day’s expenses run above the average in this window."
        : "Recent daily expenses are in line with the average in this window.",
      accent: balanceUp
        ? "text-sky-600 dark:text-sky-400"
        : "text-rose-600 dark:text-rose-400",
    });
  } else {
    cards.push({
      key: "trend",
      icon: "trendUp",
      title: "Quick read on the data",
      body:
        trendData.length === 1
          ? "Only one day with activity so far — add more transactions to see a clearer trend."
          : "Add transactions across multiple dates to see how balance moves over time.",
      hint: "Balance trend uses your actual transaction dates.",
      accent: "text-sky-600 dark:text-sky-400",
    });
  }

  return cards;
}

const TransactionsContext = createContext(null);

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState(
    () => loadFromStorage() ?? [...SEED_TRANSACTIONS],
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {
      /* ignore quota */
    }
  }, [transactions]);

  const addTransaction = useCallback((payload) => {
    setTransactions((prev) => [{ id: newId(), ...payload }, ...prev]);
  }, []);

  const updateTransaction = useCallback((id, payload) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...payload } : t)),
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const summary = useMemo(() => computeSummary(transactions), [transactions]);
  const trendChartData = useMemo(
    () => computeTrend(transactions),
    [transactions],
  );
  const expenseByCategory = useMemo(
    () => computeExpenseCategories(transactions),
    [transactions],
  );
  const monthlyComparison = useMemo(
    () => computeMonthlyComparison(transactions),
    [transactions],
  );
  const insightCards = useMemo(
    () =>
      computeInsightCards(trendChartData, expenseByCategory, monthlyComparison),
    [trendChartData, expenseByCategory, monthlyComparison],
  );

  const value = useMemo(
    () => ({
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      summary,
      trendChartData,
      expenseByCategory,
      monthlyComparison,
      insightCards,
    }),
    [
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      summary,
      trendChartData,
      expenseByCategory,
      monthlyComparison,
      insightCards,
    ],
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider",
    );
  }
  return ctx;
}
