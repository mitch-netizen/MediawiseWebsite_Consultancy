import Link from "next/link";
import Image from "next/image";
import { ABN, EMAIL, PHONE, PHONE_HREF, offers } from "../lib/content";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Image src="/logo-horizontal-dark.png" alt="Mediawise Solutions" width={390} height={181} />
            <p className="muted">Marketing, revenue strategy and automation for regional businesses. Based in Central Queensland, working Australia wide.</p>
          </div>
          <div>
            <h4>Automation</h4>
            <ul>
              {offers.map((o) => (
                <li key={o.slug}><Link href={`/automation/${o.slug}`}>{o.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Get in touch</h4>
            <ul>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><a href={PHONE_HREF}>{PHONE}</a></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/about">About</Link></li>
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
