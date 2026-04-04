import React from "react";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo of the application */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200 shadow-sm dark:bg-neutral-900 dark:ring-neutral-700">
        <img src="../../FinSight-logo.png" alt="FinSight" className="h-8 w-8 object-contain" />
      </div>

      {/* Application name and description */}
      <div>
        <div className="text-sm text-slate-600 dark:text-neutral-300">Finovix</div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Financial Activity Dashboard</h1>
      </div>
    </div>
  );
}

export default Logo;
