
const TransactionsContext = createContext(null);

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState(() => loadFromStorage() ?? [...SEED_TRANSACTIONS]);

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
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...payload } : t)));
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const summary = useMemo(() => computeSummary(transactions), [transactions]);
  const trendChartData = useMemo(() => computeTrend(transactions), [transactions]);
  const expenseByCategory = useMemo(() => computeExpenseCategories(transactions), [transactions]);
  const monthlyComparison = useMemo(() => computeMonthlyComparison(transactions), [transactions]);
  const insightCards = useMemo(
    () => computeInsightCards(trendChartData, expenseByCategory, monthlyComparison),
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

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  return ctx;
}
