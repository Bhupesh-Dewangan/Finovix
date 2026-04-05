import React, { useEffect, useMemo, useState } from "react";
import { useFinUI } from "../context/FinUIContext";
import { useTransactions } from "../context/TransactionsContext";

const PAGE_SIZE = 10;

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function FilterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function DownloadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function PencilIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function formatRowDate(iso) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function formatAmount(type, amount) {
  const abs = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  return type === "income" ? `+${abs}` : `-${abs}`;
}

function csvEscape(value) {
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(rows) {
  const header = ["Date", "Category", "Type", "Amount"];
  const lines = [
    header.join(","),
    ...rows.map((r) => [r.date, csvEscape(r.category), r.type, r.amount].join(",")),
  ];
  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function monthLabel(ym) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function TransactionForm({ title, initial, submitLabel, onSubmit, onCancel }) {
  const [date, setDate] = useState(initial.date);
  const [category, setCategory] = useState(initial.category);
  const [type, setType] = useState(initial.type);
  const [amount, setAmount] = useState(String(initial.amount));
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const cat = category.trim();
    if (!cat) {
      setError("Category is required.");
      return;
    }
    const num = Number.parseFloat(amount);
    if (!Number.isFinite(num) || num <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }
    setError("");
    onSubmit({ date, category: cat, type, amount: Math.round(num * 100) / 100 });
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-[border-color,box-shadow] duration-150 ease-out focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-neutral-600 dark:focus:ring-neutral-500/30";
  const labelClass = "text-xs font-medium text-slate-600 dark:text-neutral-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div>
        <label className={labelClass} htmlFor="tx-date">
          Date
        </label>
        <input id="tx-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="tx-category">
          Category
        </label>
        <input
          id="tx-category"
          type="text"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
          placeholder="e.g. Groceries"
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="tx-type">
          Type
        </label>
        <select id="tx-type" value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="tx-amount">
          Amount (USD)
        </label>
        <input
          id="tx-amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass}
        />
      </div>
      {error ? <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p> : null}
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 ease-out hover:bg-slate-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-slate-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function FormModal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="fin-modal-backdrop absolute inset-0 bg-black/40 dark:bg-black/60"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        className="fin-modal-panel relative z-10 max-h-[min(90vh,32rem)] w-full max-w-md overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-neutral-900"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end border-b border-slate-200 px-2 py-1 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DeleteTransactionDialog({ row, onCancel, onConfirm }) {
  const messageBoxClass =
    "rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-3 text-sm leading-relaxed text-slate-700 dark:border-neutral-700 dark:bg-neutral-950/60 dark:text-neutral-300";

  return (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Delete transaction</h3>
      </div>
      <div className={messageBoxClass}>
        <p>Are you sure you want to delete this transaction? This cannot be undone.</p>
        <p className="mt-3 font-medium text-slate-900 dark:text-white">
          {row.category}
          <span className="font-normal text-slate-500 dark:text-neutral-500"> · </span>
          {formatRowDate(row.date)}
          <span className="font-normal text-slate-500 dark:text-neutral-500"> · </span>
          {formatAmount(row.type, row.amount)}
        </p>
      </div>
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-slate-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function RecentTransactions() {
  const { role } = useFinUI();
  const canMutate = role === "admin";
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const monthOptions = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => set.add(t.date.slice(0, 7)));
    return [...set].sort().reverse();
  }, [transactions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions
      .filter((row) => {
        if (typeFilter !== "all" && row.type !== typeFilter) return false;
        if (monthFilter && row.date.slice(0, 7) !== monthFilter) return false;
        if (dateFrom && row.date < dateFrom) return false;
        if (dateTo && row.date > dateTo) return false;
        if (!q) return true;
        return row.category.toLowerCase().includes(q) || row.type.includes(q);
      })
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [transactions, query, typeFilter, monthFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const effectivePage = Math.min(page, totalPages);
  const showPagination = filtered.length > PAGE_SIZE;
  const pagedRows = showPagination
    ? filtered.slice((effectivePage - 1) * PAGE_SIZE, effectivePage * PAGE_SIZE)
    : filtered;

  useEffect(() => {
    setPage(1);
  }, [query, typeFilter, monthFilter, dateFrom, dateTo]);

  const clearDuration = () => {
    setDateFrom("");
    setDateTo("");
  };

  const handleExport = () => {
    downloadCsv(filtered);
  };

  const handleAdd = (payload) => {
    addTransaction(payload);
    setAddOpen(false);
  };

  const handleEdit = (payload) => {
    if (!editing) return;
    updateTransaction(editing.id, payload);
    setEditing(null);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteTransaction(deleting.id);
    setDeleting(null);
  };

  const rangeStart = filtered.length === 0 ? 0 : (effectivePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = filtered.length === 0 ? 0 : Math.min(effectivePage * PAGE_SIZE, filtered.length);

  return (
    <section
      aria-labelledby="recent-transactions-heading"
      className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-[box-shadow,border-color] duration-200 ease-out hover:shadow-md dark:border-white/10 dark:bg-neutral-900/90 dark:hover:shadow-none dark:hover:ring-1 dark:hover:ring-white/10 md:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="recent-transactions-heading" className="text-lg font-semibold text-slate-900 dark:text-white">
          Recent Transactions
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-[background-color,box-shadow] duration-150 ease-out hover:bg-slate-50 hover:shadow dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <DownloadIcon className="h-4 w-4" />
            Export CSV
          </button>
          <button
            type="button"
            disabled={!canMutate}
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-[background-color,box-shadow,opacity] duration-150 ease-out hover:bg-slate-800 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            <PlusIcon className="h-4 w-4" />
            Add New
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <div className="relative min-w-0 w-full">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
          <input
            type="search"
            placeholder="Search transactions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-[border-color,box-shadow] duration-150 ease-out focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-neutral-700 dark:bg-neutral-950/60 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-600 dark:focus:ring-neutral-500/30"
            aria-label="Search transactions"
          />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="flex shrink-0 items-center gap-2">
            <FilterIcon className="h-4 w-4 text-slate-500 dark:text-neutral-400" aria-hidden />
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-slate-700 transition-[border-color,box-shadow] duration-150 ease-out focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:focus:border-neutral-600 dark:focus:ring-neutral-500/30"
                aria-label="Filter by transaction type"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-neutral-400" />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-[220px]">
            <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">Month</span>
            <div className="relative">
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-slate-700 transition-[border-color,box-shadow] duration-150 ease-out focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:focus:border-neutral-600 dark:focus:ring-neutral-500/30"
                aria-label="Filter by calendar month"
              >
                <option value="">All months</option>
                {monthOptions.map((ym) => (
                  <option key={ym} value={ym}>
                    {monthLabel(ym)}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-neutral-400" />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">From</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-[border-color,box-shadow] duration-150 ease-out focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-neutral-600 dark:focus:ring-neutral-500/30"
                aria-label="Start date"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">To</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-[border-color,box-shadow] duration-150 ease-out focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-neutral-600 dark:focus:ring-neutral-500/30"
                aria-label="End date"
              />
            </div>
            {(dateFrom || dateTo) && (
              <button
                type="button"
                onClick={clearDuration}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Clear dates
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200/80 dark:border-white/10">
        <table className="min-w-[640px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-white/10 dark:bg-neutral-950/50">
              <th scope="col" className="px-4 py-3 font-medium text-slate-500 dark:text-neutral-400">
                Date
              </th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-500 dark:text-neutral-400">
                Category
              </th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-500 dark:text-neutral-400">
                Type
              </th>
              <th scope="col" className="px-4 py-3 font-medium text-slate-500 dark:text-neutral-400">
                Amount
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-slate-500 dark:text-neutral-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500 dark:text-neutral-400">
                  No transactions match your filters.
                </td>
              </tr>
            ) : (
              pagedRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 transition-colors duration-150 last:border-0 hover:bg-slate-50/80 dark:border-white/5 dark:hover:bg-neutral-800/40"
                >
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-neutral-400">
                    {formatRowDate(row.date)}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-neutral-100">{row.category}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={
                        row.type === "income"
                          ? "inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "inline-block rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                      }
                    >
                      {row.type === "income" ? "INCOME" : "EXPENSE"}
                    </span>
                  </td>
                  <td
                    className={
                      row.type === "income"
                        ? "px-4 py-3.5 font-semibold text-emerald-600 dark:text-emerald-400"
                        : "px-4 py-3.5 font-semibold text-slate-900 dark:text-neutral-100"
                    }
                  >
                    {formatAmount(row.type, row.amount)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        disabled={!canMutate}
                        title="Edit"
                        onClick={() => setEditing(row)}
                        className="rounded-md p-2 text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                        aria-label={`Edit ${row.category}`}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={!canMutate}
                        title="Delete"
                        onClick={() => setDeleting(row)}
                        className="rounded-md p-2 text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                        aria-label={`Delete ${row.category}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && filtered.length > 0 ? (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 dark:border-white/10 dark:text-neutral-400 sm:flex-row">
          <p className="tabular-nums">
            Showing {rangeStart}–{rangeEnd} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={effectivePage <= 1}
              onClick={() => setPage(Math.max(1, effectivePage - 1))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-600 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            >
              Previous
            </button>
            <span className="min-w-[5rem] text-center tabular-nums">
              Page {effectivePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={effectivePage >= totalPages}
              onClick={() => setPage(Math.min(totalPages, effectivePage + 1))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-600 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      <FormModal open={addOpen} onClose={() => setAddOpen(false)}>
        <TransactionForm
          key="add"
          title="Add transaction"
          submitLabel="Save"
          initial={{ date: new Date().toISOString().slice(0, 10), category: "", type: "expense", amount: "" }}
          onSubmit={handleAdd}
          onCancel={() => setAddOpen(false)}
        />
      </FormModal>

      <FormModal open={Boolean(editing)} onClose={() => setEditing(null)}>
        {editing ? (
          <TransactionForm
            key={editing.id}
            title="Edit transaction"
            submitLabel="Update"
            initial={{
              date: editing.date,
              category: editing.category,
              type: editing.type,
              amount: editing.amount,
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditing(null)}
          />
        ) : null}
      </FormModal>

      <FormModal open={Boolean(deleting)} onClose={() => setDeleting(null)}>
        {deleting ? (
          <DeleteTransactionDialog
            key={deleting.id}
            row={deleting}
            onCancel={() => setDeleting(null)}
            onConfirm={confirmDelete}
          />
        ) : null}
      </FormModal>
    </section>
  );
}

export default RecentTransactions;
