import React from "react";
import NavBar from "./components/NavBar";
import { FinUIProvider } from "./context/FinUIContext";
import { TransactionsProvider } from "./context/TransactionsContext";
import MainContent from "./components/MainContent";

function App() {
  return (
    <FinUIProvider>
      <TransactionsProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-neutral-950 dark:text-neutral-100">
          <NavBar />
          <MainContent />
        </div>
      </TransactionsProvider>
    </FinUIProvider>
  );
}

export default App;
