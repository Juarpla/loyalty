"use client";

interface ColorSwatchProps {
  color: string;
}

export function ColorSwatch({ color }: ColorSwatchProps) {
  const brandColorPattern = /^#[0-9a-fA-F]{6}$/;
  const isValidColor = brandColorPattern.test(color);
  const displayColor = isValidColor ? color : "#ef4444";

  return (
    <div className="flex items-center gap-3">
      <div
        data-testid="color-swatch"
        className="h-10 w-10 rounded border border-zinc-700 transition-colors duration-200"
        style={{ backgroundColor: displayColor }}
      />
      <span className="text-sm text-zinc-400">
        {isValidColor ? `Swatch: ${color}` : "Invalid hex color"}
      </span>
    </div>
  );
}
