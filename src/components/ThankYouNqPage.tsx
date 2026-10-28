import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const FEATURES = [
  {
    title: "Faster Than Banks",
    body: "Nationwide Advance offers solution that's faster, more efficient, and tailored to your needs.",
    icon: "/site/icon-faster.png",
  },
  {
    title: "Tailored Funds",
    body: "Crafting cash flow solutions unlocking your entrepreneurial potential with seamless funding.",
    icon: "/site/icon-tailored.png",
  },
  {
    title: "Loyalty Benefits",
    body: "Entrepreneurial potential with seamless funding, tailored solutions, and trusted expertise.",
    icon: "/site/icon-loyalty.png",
  },
] as const;

const STEPS = [
  {
    title: "Apply",
    body: "Our quick and easy application process makes funding as easy as can be. With just a few simple steps, you can submit your application and get on your way to accessing the financial support you need.",
    icon: "/site/icon-apply.png",
  },
  {
    title: "Approval",
    body: "Fast and Easy Funding: Get access to quick funds for your business within a matter of days, allowing you to seize opportunities and cover unexpected expenses without lengthy waiting periods of time.",
    icon: "/site/icon-approval.png",
  },
  {
    title: "Funded",
    body: "Get funded in no time and work on growing your business while we do the heavy lifting. Our efficient funding process ensures that you receive the capital you need promptly to expand your business.",
    icon: "/site/icon-funded.png",
  },
] as const;

export default function ThankYouNqPage() {
  return (
    <div className="marketing thankyou-nq">
      <header className="nq-topbar">
        <div className="nq-topbar-in">
          <Link href="/" className="site-logo" aria-label="Nationwide Advance home">
            <Image
              src="/nationwide-logo-clear.png"
              alt="Nationwide Advance"
              width={308}
              height={192}
              priority
              unoptimized
            />
          </Link>
        </div>
      </header>

      <section className="nq-hero">
        <div className="nq-hero-in">
          <p className="nq-eyebrow">Thank you</p>
          <h1>Thank you for your interest in Nationwide Advance.</h1>
          <p className="nq-lede">Unfortunately we are only able to fund businesses that:</p>
          <ul className="nq-criteria">
            <li>Have a Business Bank Account with $20k+/monthly deposits</li>
            <li>Have been in Business over 12 months</li>
            <li>Have never defaulted on a business loan or restructured an MCA</li>
          </ul>
          <div className="nq-trust">
            <Image src="/site/mcafee.png" alt="McAfee Secure" width={95} height={35} unoptimized />
          </div>
        </div>
      </section>

      <section className="feature-row">
        <div className="feature-row-in">
          {FEATURES.map((f) => (
            <article key={f.title} className="feature-card">
              <Image src={f.icon} alt="" width={65} height={65} unoptimized />
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
          <article className="feature-card feature-card--maroon">
            <h3>Transparent Pricing</h3>
            <p>Clarity in every transaction. Honest rates, no surprises. Join us for seamless funding.</p>
            <Link href="/apply" className="btn-outline-light">
              Apply Today
            </Link>
          </article>
        </div>
      </section>

      <section className="split-section">
        <div className="split-section-in">
          <Image
            src="/site/home-side.jpg"
            alt="Entrepreneurs reviewing cash flow"
            width={784}
            height={534}
            unoptimized
          />
          <div>
            <h2>Aiding Entrepreneurs in Generating Cash Flow</h2>
            <p>
              We take pride in the professionalism, trust and amazing speed we offer in helping you
              develop/create your dream. As we know it is very hard nowadays to get funding in a
              timely matter from a bank. Therefore we give an alternative funding route to funding
              that is as seamless as it should be.
            </p>
            <p>
              Allow our funding representatives to provide you with the tools and funding needed. We
              look at you as a partner not just another customer. It is very important we serve you
              with all the knowledge you will need on our overall product as well.
            </p>
          </div>
        </div>
      </section>

      <section className="steps-section">
        <div className="steps-section-in">
          <p className="section-eyebrow">Solutions for Business Finance</p>
          <h2>Unleashing Opportunities, Empowering Futures. We have very simple &amp; easy steps.</h2>
          <div className="steps-grid">
            {STEPS.map((s) => (
              <article key={s.title}>
                <Image src={s.icon} alt="" width={65} height={65} unoptimized />
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="split-section split-section--rev">
        <div className="split-section-in">
          <div>
            <h2>Top-notch Security</h2>
            <p>
              Our application and funding process is entirely secure by industry-leading security
              standards. Your privacy and data protection are paramount to us, which is why we employ
              the latest encryption technologies and robust security measures to safeguard your
              sensitive information throughout every step of the process.
            </p>
            <p>
              Your personal and financial details are kept confidential and protected against
              unauthorized access or breaches. We adhere strictly to compliance regulations and
              continuously monitor and update our security protocols to stay ahead of emerging
              threats.
            </p>
          </div>
          <Image
            src="/site/security.jpg"
            alt="Secure funding process"
            width={784}
            height={534}
            unoptimized
          />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
