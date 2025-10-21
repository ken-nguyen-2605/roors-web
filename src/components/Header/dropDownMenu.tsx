import React from "react";
import Link from "react"

/**
 * Drop this into a Next.js project (App Router or Pages) with Tailwind set up.
 * It renders a paper-like menu with a punched hole on the right of each row.
 */

const items = [
  { label: "Log in", href: "#login" },
  { label: "Log out", href: "#logout" },
  { label: "Profile", href: "#profile" },
];

export default function PaperMenu() {
  return (
    <div className="w-full grid place-items-center">
      <div className="w-[200px] select-none">
        <div
          className="relative rounded-3xl border border-zinc-200 shadow-[0_12px_30px_rgba(0,0,0,0.12)] overflow-hidden"
          style={{
            // Subtle paper tone + texture
            background:
            //   "repeating-linear-gradient( #f7f5ee, #f7f5ee 28px, #f5f4ed 28px, #f5f4ed 56px)",
            "#f5f4ed"
          }}
        >
          {items.map((item, i) => (
            <Row key={item.label} label={item.label} isLast={i === items.length - 1} />
          ))}

          {/* Soft outer shadow to lift the whole card off page */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]" />
        </div>
      </div>
    </div>
  );
}

function Row({ label, isLast }: { label: string; isLast?: boolean }) {
  return (
    <a
      href="#"
      className={[
        "group relative flex items-center justify-between",
        "py-1 px-3 text-xl font-[\"Bellefair\",_ui-serif,Georgia,serif]",
        "transition-colors",
        isLast ? "" : "border-b border-black/20",
        "hover:bg-white/60",
      ].join(" ")}
    >
      <span className="text-zinc-800 group-hover:text-zinc-900">{label}</span>

      {/* The punched hole */}
      <span className="absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center">
        <Hole />
      </span>

      {/* Focus ring for accessibility */}
      <span className="absolute inset-0 rounded-none focus-within:outline-none">
        <button aria-label={label} className="sr-only" />
      </span>
    </a>
  );
}

/**
 * Circular "hole" that visually punches through the paper using masking.
 * Works against any page background color because it reveals the parent's background.
 */
function Hole() {
  return (
    <span
      className="relative block h-5 w-5 rounded-full"
      style={{
        // Use mask to cut a clean hole out of the paper row
        WebkitMask:
          "radial-gradient(circle at center, transparent 1px, black 1px)",
        mask: "radial-gradient(circle at center, transparent 1px, black 1px)",
      }}
    >
      {/* edge ring & inner shadow to sell the punch effect */}
      <span className="absolute inset-0 rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.06),inset_2px_2px_10px_rgba(0,0,0,0.12),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]" />
    </span>
  );
}
