import { useFinUI } from "../context/FinUIContext";

export function useChartTheme() {
  const { theme } = useFinUI();
  const dark = theme === "dark";
  return {
    dark,
    gridStroke: dark ? "rgba(255,255,255,0.09)" : "#e2e8f0",
    tickFill: dark ? "#a3a3a3" : "#64748b",
    tooltipBg: dark ? "#171717" : "#ffffff",
    tooltipBorder: dark ? "#404040" : "#e2e8f0",
    tooltipLabel: dark ? "#fafafa" : "#0f172a",
    pieSegmentStroke: dark ? "#171717" : "#ffffff",
    cursorStroke: dark ? "#525252" : "#cbd5e1",
  };
}
