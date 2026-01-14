import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Box, Icon } from "@archway/valet";

interface ConfirmableNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  width?: string;
}

export function ConfirmableNumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  width = "60px",
}: ConfirmableNumberInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [pendingValue, setPendingValue] = useState("");
  const [originalValue, setOriginalValue] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const ignoreBlurRef = useRef(false);

  // Sync pendingValue when external value changes while not editing
  useEffect(() => {
    if (!isEditing) {
      setPendingValue(String(value));
    }
  }, [value, isEditing]);

  const hasChanges = isEditing && pendingValue !== String(originalValue);

  const handleFocus = () => {
    setOriginalValue(value);
    setPendingValue(String(value));
    setIsEditing(true);
  };

  const handleConfirm = () => {
    let parsed = parseFloat(pendingValue);
    if (isNaN(parsed)) {
      parsed = originalValue;
    }
    if (min !== undefined) {
      parsed = Math.max(min, parsed);
    }
    if (max !== undefined) {
      parsed = Math.min(max, parsed);
    }
    onChange(parsed);
    setIsEditing(false);
    ignoreBlurRef.current = false;
  };

  const handleCancel = () => {
    setPendingValue(String(originalValue));
    setIsEditing(false);
    ignoreBlurRef.current = false;
  };

  const handleBlur = () => {
    if (ignoreBlurRef.current) {
      ignoreBlurRef.current = false;
      return;
    }
    handleCancel();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
      inputRef.current?.blur();
    }
  };

  // Prevent blur when clicking confirm/cancel buttons
  const handleButtonMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    ignoreBlurRef.current = true;
  };

  const baseInputStyle: React.CSSProperties = {
    width,
    height: "18px",
    fontSize: "10px",
    padding: "0 3px",
    border: hasChanges
      ? "1px solid rgba(75, 208, 210, 0.6)"
      : "1px solid rgba(255,255,255,0.2)",
    borderRadius: "2px",
    backgroundColor: hasChanges
      ? "rgba(75, 208, 210, 0.15)"
      : "rgba(0,0,0,0.3)",
    color: "inherit",
    outline: "none",
    fontVariantNumeric: "tabular-nums",
  };

  const iconButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "16px",
    height: "16px",
    cursor: "pointer",
    borderRadius: "2px",
    transition: "background-color 0.1s",
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
      }}
    >
      <input
        ref={inputRef}
        type="number"
        min={min}
        max={max}
        step={step}
        value={pendingValue}
        onChange={(e) => setPendingValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={baseInputStyle}
      />
      {hasChanges && (
        <>
          <div
            onMouseDown={handleButtonMouseDown}
            onClick={handleConfirm}
            style={{
              ...iconButtonStyle,
              backgroundColor: "rgba(75, 208, 210, 0.3)",
            }}
            title="Confirm (Enter)"
          >
            <Icon icon="mdi:check" size="xs" />
          </div>
          <div
            onMouseDown={handleButtonMouseDown}
            onClick={handleCancel}
            style={{
              ...iconButtonStyle,
              backgroundColor: "rgba(255, 100, 100, 0.3)",
            }}
            title="Cancel (Escape)"
          >
            <Icon icon="mdi:close" size="xs" />
          </div>
        </>
      )}
    </Box>
  );
}
