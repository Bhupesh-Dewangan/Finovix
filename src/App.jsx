import React from "react";
import NavBar from "./components/NavBar";
import { FinUIProvider } from "./context/FinUIContext";

function App() {
  return (
    <FinUIProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <NavBar />
      </div>
    </FinUIProvider>
  );
}

export default App;
