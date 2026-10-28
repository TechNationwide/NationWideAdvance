import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function PrivacyPage() {
  return (
    <div className="marketing">
      <SiteHeader />
      <main className="inner-page">
        <div className="inner-page-in">
          <h1>Privacy Policy</h1>
          <p>
            Nationwide Advance protects your personal and business information with industry-standard
            security practices. Information submitted through our forms is used to evaluate funding
            options and communicate with you about your application.
          </p>
          <p>
            For privacy questions, contact{" "}
            <a href="mailto:admin@nationwideadvance.com">admin@nationwideadvance.com</a>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
