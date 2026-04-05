import React from "react";
import SummarySection from "./SummarySection";
import BalanceTrend from "./BalanceTrend";
import InsightSection from "./InsightSection";
import SpendingCategory from "./SpendingCategory";
import SpendingBreakdown from "./SpendingBreakdown";

function MainContent() {
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 md:py-8">
      <SummarySection />

      <div className="grid gap-8 lg:grid-cols-[7fr_3fr] lg:items-start">
        <div className="min-w-0 lg:max-w-none">
          <BalanceTrend />
        </div>
        <div className="min-w-0">
          <InsightSection />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
        <div className="flex h-full min-h-0 min-w-0">
          <SpendingCategory />
        </div>
        <div className="flex h-full min-h-0 min-w-0">
          <SpendingBreakdown />
        </div>
      </div>


    </main>
  );
}

export default MainContent;
