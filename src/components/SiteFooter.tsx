import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-in">
        <div className="site-footer-grid">
          <div>
            <h3>Nationwide Advance</h3>
            <p>
              Empower your business with our flexible business financing. Transform your business
              trajectory with adaptable financing solutions tailored to your needs.
            </p>
          </div>
          <div>
            <h3>Navigation</h3>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/services">Services</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <p>Nationwide Advance, USA</p>
            <p>
              Email:{" "}
              <a href="mailto:admin@nationwideadvance.com">admin@nationwideadvance.com</a>
            </p>
            <p>
              Questions? <a href="tel:8888916772">888-891-6772</a>
            </p>
          </div>
        </div>
        <div className="site-footer-bar">
          <span>© {new Date().getFullYear()} Nationwide Advance. All Rights Reserved.</span>
          <span>
            <Link href="/privacy">Privacy</Link> | <Link href="/terms">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
