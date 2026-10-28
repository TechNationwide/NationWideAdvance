"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

export default function SiteHeader({ tone = "light" }: { tone?: "light" | "apply" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={`site-header site-header--${tone}`}>
      <div className="site-header-in">
        <Link href="/" className="site-logo" aria-label="Nationwide Advance home">
          <Image
            src="/nationwide-logo-clear.png"
            alt="Nationwide Advance"
            width={308}
            height={192}
            priority
            unoptimized
          />
        </Link>

        <nav className="site-nav" aria-label="Main">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={active ? "is-active" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-header-actions">
          <Link href="/apply" className="btn-apply">
            Apply for Funding
          </Link>
          <button
            type="button"
            className="site-menu-btn"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open ? (
        <div className="site-mobile-nav">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/apply" className="btn-apply" onClick={() => setOpen(false)}>
            Apply for Funding
          </Link>
        </div>
      ) : null}
    </header>
  );
}
