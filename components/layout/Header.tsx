"use client";
import { useTheme } from "@/lib/hooks/useTheme";
import { Sun, Moon, Code2 } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { dark, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-[var(--border-color)]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
          <Code2 className="w-5 h-5 text-brand-400" />
          <span>DSA Explorer</span>
        </Link>
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
