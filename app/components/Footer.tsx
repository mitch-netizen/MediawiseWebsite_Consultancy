import Link from "next/link";
import Image from "next/image";
import { ABN, EMAIL, PHONE, PHONE_HREF, areas } from "../lib/content";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Image src="/logo-horizontal-dark.png" alt="Mediawise Solutions" width={390} height={181} />
            <p className="muted">Marketing, revenue and systems for established regional businesses. Based in Central Queensland, working Australia wide.</p>
          </div>
          <div>
            <h2 className="footer-h">Services</h2>
            <ul>
              {areas.map((a) => (
                <li key={a.slug}><Link href={`/services/${a.slug}`}>{a.name}</Link></li>
              ))}
              <li><Link href="/automation">Automation builds</Link></li>
              <li><Link href="/who-its-for">Who it&apos;s for</Link></li>
              <li><Link href="/how-it-works">How it works</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-h">Get in touch</h2>
            <ul>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><a href={PHONE_HREF}>{PHONE}</a></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/how-it-works#faq">FAQs</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          © {new Date().getFullYear()} Mediawise Solutions. ABN {ABN}. All prices exclude GST.
        </div>
      </div>
    </footer>
  );
}
