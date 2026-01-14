import type { TransformMode } from "@/types";

export const TRANSFORM_MODES: TransformMode[] = ["translate", "rotate", "scale"];
export const AXES = ["X", "Y", "Z"] as const;

export const panelHeaderStyle = {
  flexShrink: 0,
  padding: "6px 10px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  opacity: 0.95,
  userSelect: "none" as const,
};

export const panelScrollStyle = {
  flex: 1,
  overflowY: "auto" as const,
  overflowX: "hidden" as const,
  minHeight: 0,
};

export const fieldLabelSx = {
  fontSize: "11px",
  lineHeight: 1.2,
  opacity: 0.82,
  fontWeight: 500,
};

export const compactLabelSx = {
  fontSize: "10px",
  lineHeight: 1.2,
  opacity: 0.8,
  fontWeight: 500,
};

export const sectionHeaderSx = {
  fontSize: "10px",
  lineHeight: 1.2,
  opacity: 0.65,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  padding: "6px 4px 1px 4px",
  borderTop: "1px solid rgba(255,255,255,0.1)",
  marginTop: "2px",
};

export const axisLabelSx = {
  fontSize: "10px",
  opacity: 0.65,
  textAlign: "center" as const,
  fontWeight: 600,
};

export const tinyLabelSx = {
  fontSize: "9px",
  lineHeight: 1.1,
  opacity: 0.6,
  fontWeight: 600,
};

export const toggleButtonSx = {
  padding: "2px 8px",
  minHeight: "24px",
  fontSize: "10px",
  lineHeight: "20px",
  fontWeight: 600,
};

export const quickButtonSx = {
  fontSize: "9px",
  padding: "1px 4px",
  minHeight: "14px",
  minWidth: "20px",
  lineHeight: 1,
  fontWeight: 600,
};

export const wrapRowSx = {
  flexWrap: "wrap" as const,
  columnGap: "6px",
  rowGap: "8px",
};

export const sliderPrecisionFromStep = (step?: number) => {
  if (!step) return 0;
  const stepText = step.toString();
  const dotIndex = stepText.indexOf(".");
  if (dotIndex === -1) return 0;
  return stepText.length - dotIndex - 1;
};
