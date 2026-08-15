import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useFinUI } from "../context/FinUIContext";
import { useAuth } from "../context/AuthContext";

function LogOutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function NavBar() {
  const { theme } = useFinUI();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-[background-color,border-color] duration-200 dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/dashboard" className="flex items-center">
          <Logo />
        </Link>
        <div className="flex shrink-0 items-center gap-3">
          {user && (
            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="h-4 w-4 text-slate-500 dark:text-neutral-400" />
              <span className="text-slate-700 dark:text-neutral-300">
                {user.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-neutral-500">
                ({user.role})
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            title="Logout"
          >
            <LogOutIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default NavBar;
