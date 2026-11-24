"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BOOKING_URL } from "../lib/content";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/automation", label: "Automation" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Mediawise Solutions home">
          <Image src="/logo-horizontal-dark.png" alt="Mediawise Solutions" width={390} height={181} priority />
        </Link>
        <nav className="nav" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
          <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a chat</a>
        </nav>
        <button className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <nav id="mobile-nav" className="mobile-nav" data-open={open} aria-label="Mobile">
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
        ))}
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 20 minute chat</a>
      </nav>
    </header>
  );
}
