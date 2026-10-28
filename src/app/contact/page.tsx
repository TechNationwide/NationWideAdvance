import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function ContactPage() {
  return (
    <div className="marketing">
      <SiteHeader />
      <main className="inner-page">
        <div className="inner-page-in">
          <p className="section-eyebrow">Contact</p>
          <h1>Get in touch</h1>
          <p>Nationwide Advance, USA</p>
          <p>
            Email:{" "}
            <a href="mailto:admin@nationwideadvance.com">admin@nationwideadvance.com</a>
          </p>
          <p>
            Questions? <a href="tel:8888916772">888-891-6772</a>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
