"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BOOKING_URL, areas } from "../lib/content";

const serviceLinks = [
  ...areas.map((a) => ({ href: `/services/${a.slug}`, label: a.name, note: a.stages, tone: a.tone })),
  { href: "/automation", label: "Automation builds", note: "Five fixed price fixes", tone: "blue" },
  { href: "/pricing", label: "Automation pricing", note: "Setup, bundles and care plans", tone: "blue" },
];

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
const mobileExtra = [{ href: "/who-its-for", label: "Who it's for" }];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [svc, setSvc] = useState(false);
  const svcRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (svcRef.current && !svcRef.current.contains(e.target as Node)) setSvc(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setSvc(false); };
    document.addEventListener("click", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", esc); };
  }, []);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Mediawise Solutions home">
          <Image src="/logo-horizontal-dark.png" alt="Mediawise Solutions" width={390} height={181} priority />
        </Link>
        <nav className="nav" aria-label="Main">
          <div className="svc" ref={svcRef}>
            <button className="svc-toggle" aria-expanded={svc} aria-controls="svc-menu" onClick={() => setSvc(!svc)}>
              Services <span className="caret" aria-hidden="true" />
            </button>
            <div id="svc-menu" className="svc-menu" data-open={svc}>
              {serviceLinks.map((s) => (
                <Link key={s.href} href={s.href} className={`svc-item tone-${s.tone}`} onClick={() => setSvc(false)}>
                  <span className="svc-label">{s.label}</span>
                  <span className="svc-note">{s.note}</span>
                </Link>
              ))}
            </div>
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
          <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a call</a>
        </nav>
        <button className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <nav id="mobile-nav" className="mobile-nav" data-open={open} aria-label="Mobile">
        {serviceLinks.map((s) => (
          <Link key={s.href} href={s.href} className={`m-svc tone-${s.tone}`} onClick={() => setOpen(false)}>{s.label}</Link>
        ))}
        {[...mobileExtra, ...links].map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
        ))}
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20 minute chat</a>
      </nav>
    </header>
  );
}
