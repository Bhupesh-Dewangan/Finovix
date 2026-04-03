import React from "react";

function RoleSwitcher({ role, onRoleChange }) {
  const baseBtn =
    "rounded-full px-3.5 py-2 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-neutral-950";
  const inactive =
    "text-slate-600 hover:bg-white/70 hover:text-slate-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white";
  const active =
    "bg-white text-slate-900 shadow-md ring-1 ring-slate-200/80 dark:bg-neutral-800 dark:text-white dark:ring-white/15";

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-100/95 p-0.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
      role="group"
      aria-label="Role"
    >
      <button
        type="button"
        className={`${baseBtn} ${role === "viewer" ? active : inactive}`}
        onClick={() => onRoleChange("viewer")}
        aria-pressed={role === "viewer"}
      >
        Viewer
      </button>

      <button
        type="button"
        className={`flex items-center gap-1.5 ${baseBtn} ${role === "admin" ? active : inactive}`}
        onClick={() => onRoleChange("admin")}
        aria-pressed={role === "admin"}
      >
        <span className="hidden md:inline">Admin</span>
        <span className="md:hidden">A</span>
      </button>
    </div>
  );
}

export default RoleSwitcher;
