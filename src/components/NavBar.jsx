import React from "react";
import RoleSwitcher from "./RoleSwitcher";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useFinUI } from "../context/FinUIContext";

function NavBar() {
  const { role, setRole } = useFinUI();

  return (
    <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-[background-color,border-color] duration-200 dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Logo />
        <div className="flex shrink-0 items-center gap-3">
          <RoleSwitcher role={role} onRoleChange={setRole} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default NavBar;
