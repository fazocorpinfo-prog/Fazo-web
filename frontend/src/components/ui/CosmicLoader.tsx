"use client";

export function CosmicLoader({ size = 30 }: { size?: number }) {
  return (
    <span
      aria-label="Loading"
      className="relative inline-flex items-center justify-center"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <span className="cosmic-loader-ring cosmic-loader-ring-a" />
      <span className="cosmic-loader-ring cosmic-loader-ring-b" />
      <span className="cosmic-loader-ring cosmic-loader-ring-c" />
      <span className="cosmic-loader-core" />
    </span>
  );
}
