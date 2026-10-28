"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { CAPITAL_OPTIONS } from "@/lib/lead-options";
import { saveLead } from "@/lib/lead-storage";

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

const PRODUCTS = [
  {
    title: "Same Day Funding",
    body: "Leveraging our relationships with banks and private investors we can get you funded same day in most cases.",
    icon: "/site/same-day.png",
  },
  {
    title: "Lines Of Credit",
    body: "With the lowest rates in the industry we can offer you several options for lines of credits.",
    icon: "/site/loc.png",
  },
  {
    title: "Term Loans",
    body: "Our term loan program can help you run your business without negatively impacting you or your business.",
    icon: "/site/term-loans.png",
  },
] as const;

const TESTIMONIALS = [
  {
    name: "Jacob Jones",
    img: "/site/jacob.png",
    quote:
      "Before discovering Nationwide Advance, I was struggling to keep my business afloat due to cash flow issues. However, everything changed when I reached out to them for assistance. Their exceptional customer service and personalized approach made all the difference.",
  },
  {
    name: "Adison Kenter",
    img: "/site/adison.png",
    quote:
      "Nationwide Advance has been a true blessing for my small business. As a restaurant owner, I faced numerous challenges during the pandemic, and securing traditional financing seemed impossible. Their quick approval and funding process allowed me to keep my doors open.",
  },
  {
    name: "Kristin Watson",
    img: "/site/kristin.png",
    quote:
      "Nationwide Advance has been a game-changer for my business! When I needed quick funding to expand my operations, they came through with flying colors. The application process was seamless, and their team of experts guided me every step of the way.",
  },
] as const;

export default function HomePage() {
  const router = useRouter();
  const [capital, setCapital] = useState("");
  const [error, setError] = useState("");

  function onHeroContinue(e: FormEvent) {
    e.preventDefault();
    if (!capital) {
      setError("Please select how much capital your business needs.");
      return;
    }
    saveLead({
      capitalNeeded: capital,
      businessName: "",
      timeInBusiness: "",
      businessBankAccount: "",
      industry: "",
      phone: "",
    });
    router.push(`/apply?req=${encodeURIComponent(capital)}`);
  }

  return (
    <div className="marketing">
      <SiteHeader />

      <section className="home-hero">
        <div className="home-hero-in">
          <div className="home-hero-copy">
            <p className="home-kicker">
              <span /> Nationwide Advance
            </p>
            <h1>Business financing to run your business</h1>
            <p className="home-lede">
              Empower your business with our flexible business financing. Secure your growth
              trajectory now.
            </p>
          </div>
          <div className="home-hero-art">
            <Image
              src="/site/hero-cartoon.jpg"
              alt="Business owner ready to grow"
              width={784}
              height={756}
              priority
              unoptimized
            />
          </div>
        </div>

        <form className="home-start-card" onSubmit={onHeroContinue}>
          <Image
            src="/site/start-here.png"
            alt="Start Here"
            width={216}
            height={61}
            className="start-here-img"
            unoptimized
          />
          <label htmlFor="home-capital">How much capital does your business need?*</label>
          <select
            id="home-capital"
            value={capital}
            onChange={(e) => {
              setCapital(e.target.value);
              setError("");
            }}
          >
            <option value="">Please select</option>
            {CAPITAL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {error ? <p className="field-err">{error}</p> : null}
          <button type="submit" className="btn-maroon">
            Continue
          </button>
        </form>
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
            <Link href="/services" className="btn-outline-light">
              View Our Services
            </Link>
          </article>
        </div>
      </section>

      <section className="split-section">
        <div className="split-section-in">
          <Image
            src="/site/home-side.jpg"
            alt="Working on business growth plans"
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
          <Link href="/apply" className="btn-maroon">
            Let&apos;s Get Started
          </Link>
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

      <section className="stats-section">
        <div className="stats-section-in">
          <h2>We always support in your financial expanding.</h2>
          <div className="stats-grid">
            <div>
              <strong>98%</strong>
              <span>Happy Clients</span>
            </div>
            <div>
              <strong>8%</strong>
              <span>Average Interest</span>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="testimonials-in">
          <h2>What our clients say</h2>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <article key={t.name}>
                <Image src={t.img} alt={t.name} width={100} height={100} unoptimized />
                <p>“{t.quote}”</p>
                <h3>{t.name}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="products-section-in">
          {PRODUCTS.map((p) => (
            <article key={p.title}>
              <Image src={p.icon} alt="" width={75} height={75} unoptimized />
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-band-in">
          <h2>Empower your business with our flexible business financing.</h2>
          <p>
            Transform your business trajectory with our adaptable financing solutions tailored to
            your needs. Come and be a part of Nationwide Advance.
          </p>
          <Link href="/apply" className="btn-maroon btn-maroon--light">
            Apply for Funding
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
