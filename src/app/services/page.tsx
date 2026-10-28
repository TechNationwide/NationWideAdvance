import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const SERVICES = [
  {
    title: "Merchant Cash Advance (MCA)",
    body: "Access funding based on your business performance instead of traditional collateral. Ideal when you need short-term capital quickly.",
  },
  {
    title: "Same Day Funding",
    body: "Leveraging relationships with banks and private investors, we can get you funded same day in most cases.",
  },
  {
    title: "Lines Of Credit",
    body: "Flexible credit lines with competitive rates so you can draw funds when opportunities appear.",
  },
  {
    title: "Term Loans",
    body: "Structured term financing to run and grow your business without unnecessary disruption.",
  },
] as const;

export default function ServicesPage() {
  return (
    <div className="marketing">
      <SiteHeader />
      <main className="inner-page">
        <div className="inner-page-in">
          <p className="section-eyebrow">Services</p>
          <h1>Solutions for business finance</h1>
          <p>
            Custom financing to fit your unique business needs. Apply once and explore multiple
            financing options with flexible terms.
          </p>
          <div className="services-grid">
            {SERVICES.map((s) => (
              <article key={s.title}>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
          <Link href="/apply" className="btn-maroon">
            Apply for Funding
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
