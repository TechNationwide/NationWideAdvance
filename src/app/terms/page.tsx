import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function TermsPage() {
  return (
    <div className="marketing">
      <SiteHeader />
      <main className="inner-page">
        <div className="inner-page-in">
          <h1>Terms &amp; Conditions</h1>
          <p>
            Nationwide Advance is a commercial financing broker. We help connect businesses with
            third-party funding providers. Submitting an application does not guarantee approval or
            any particular offer.
          </p>
          <p>
            By using this site and submitting information, you agree that the details you provide are
            accurate and that we may share them with funders and service providers to evaluate your
            request.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
