import React from "react";
import Link from "next/link"; // FIXED

const items = [
  { label: "Log in", href: "/login" },
  // { label: "Log out", href: "/logout" },
  { label: "Profile", href: "/profile" },
  { label: "Admin", href: "/admin" },
];

export default function PaperMenu() {
  return (
    <div className="w-full grid place-items-center">
      <div className="w-[200px] select-none">
        <div
          className="relative rounded-3xl border border-zinc-200 shadow-[0_12px_30px_rgba(0,0,0,0.12)] overflow-hidden"
          style={{
            background: "#f5f4ed",
          }}
        >
          {items.map((item, i) => (
            <Row
              key={item.label}
              label={item.label}
              href={item.href}
              isLast={i === items.length - 1}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]" />
        </div>
      </div>
    </div>
  );
}

// Now, href is passed, and Link is used.
function Row({
  label,
  href,
  isLast,
}: {
  label: string;
  href: string;
  isLast?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "group relative flex items-center justify-between",
        "py-1 px-3 text-xl font-[\"Bellefair\",_ui-serif,Georgia,serif]",
        "transition-colors",
        isLast ? "" : "border-b border-black/20",
        "hover:bg-white/60",
      ].join(" ")}
    >
      <span className="text-zinc-800 group-hover:text-zinc-900">{label}</span>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center">
        <Hole />
      </span>
      {/* Focus ring for accessibility */}
      <span className="absolute inset-0 rounded-none focus-within:outline-none">
        <button aria-label={label} className="sr-only" />
      </span>
    </Link>
  );
}

function Hole() {
  return (
    <span
      className="relative block h-5 w-5 rounded-full"
      style={{
        WebkitMask:
          "radial-gradient(circle at center, transparent 1px, black 1px)",
        mask: "radial-gradient(circle at center, transparent 1px, black 1px)",
      }}
    >
      <span className="absolute inset-0 rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.06),inset_2px_2px_10px_rgba(0,0,0,0.12),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]" />
    </span>
  );
}