import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function AboutPage() {
  return (
    <div className="marketing">
      <SiteHeader />
      <main className="inner-page">
        <div className="inner-page-in">
          <p className="section-eyebrow">About</p>
          <h1>Aiding entrepreneurs in generating cash flow</h1>
          <p>
            We take pride in the professionalism, trust and amazing speed we offer in helping you
            develop your dream. Banks can take too long — Nationwide Advance gives businesses a
            seamless alternative funding route.
          </p>
          <p>
            We look at you as a partner, not just another customer. Our funding representatives
            provide the tools and knowledge you need across our product lineup.
          </p>
          <Link href="/apply" className="btn-maroon">
            Apply for Funding
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
