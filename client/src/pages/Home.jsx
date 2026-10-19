import { Link } from "react-router-dom";
import {
  HiOutlineArrowRight,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
  HiOutlineBolt,
  HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

import Navbar from "../components/Navbar";
import Reveal from "../components/Reveal";

function Home() {
  return (
    <div className="min-h-screen bg-bg-soft">
      <Navbar />
      <Hero />
      <SolutionStatement />
      <Features />
      <WhyChoose />
      <FooterCta />
      <Footer />
    </div>
  );
}

/* ---------------------------------- Hero --------------------------------- */

function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-light blur-3xl animate-blob-pulse pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute top-40 right-0 w-72 h-72 rounded-full bg-teal-light blur-3xl animate-blob-pulse pointer-events-none"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-brand-light text-brand-dark text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          <HiOutlineSparkles className="w-4 h-4" />
          AI-Powered Healthcare Navigator
        </div>

        <h1 className="font-display text-5xl lg:text-6xl font-bold text-ink leading-[1.08] mb-6">
          Your AI-Powered
          <br />
          Health Navigator
        </h1>

        <p className="text-lg text-body max-w-lg mb-10">
          MedRoute AI matches you with the right doctor, hospital, or
          emergency care — and turns your medical reports into answers you
          can actually understand.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-7 py-3.5 rounded-full hover:bg-brand-dark hover:scale-[1.03] transition"
          >
            Get Started Free
            <HiOutlineArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#why-choose"
            className="inline-flex items-center gap-2 text-ink font-semibold px-7 py-3.5 rounded-full border border-ink/10 hover:bg-white transition"
          >
            See How It Works
          </a>
        </div>
      </div>

      <div
        className="relative animate-fade-in-up"
        style={{ animationDelay: "150ms" }}
      >
        <div className="animate-float-y">
          <InsightCardMockup />
        </div>
      </div>
    </section>
  );
}

function InsightCardMockup() {
  return (
    <div className="relative bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(36,81,224,0.35)] p-6 max-w-md ml-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wide">
            MedRoute AI
          </p>
          <p className="font-display font-semibold text-ink">
            Care Match Engine
          </p>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
      </div>

      <div className="space-y-2">
        <Pill
          icon={<HiOutlineDocumentText className="w-3.5 h-3.5" />}
          label="AI report analysis"
          tone="brand"
        />
        <Pill
          icon={<HiOutlineUserGroup className="w-3.5 h-3.5" />}
          label="Verified doctors"
          tone="teal"
        />
        <Pill
          icon={<HiOutlineBuildingOffice2 className="w-3.5 h-3.5" />}
          label="Nearby hospitals"
          tone="amber"
        />
        <Pill
          icon={<HiOutlineBolt className="w-3.5 h-3.5" />}
          label="Emergency routing"
          tone="coral"
        />
      </div>
    </div>
  );
}

function Pill({ icon, label, tone }) {
  const styles = {
    brand: "bg-brand-light text-brand-dark",
    teal: "bg-teal-light text-teal",
    amber: "bg-amber-light text-amber",
    coral: "bg-coral-light text-coral",
  }[tone];

  return (
    <div
      className={`flex items-center gap-2 ${styles} text-xs font-semibold px-3 py-2.5 rounded-lg`}
    >
      {icon}
      {label}
    </div>
  );
}

/* ---------------------------- Solution statement --------------------------- */

function SolutionStatement() {
  return (
    <Reveal as="section" className="max-w-4xl mx-auto px-6 pb-24 text-center">
      <p className="font-display text-2xl lg:text-3xl leading-relaxed">
        <span className="text-ink font-semibold">MedRoute AI</span>{" "}
        <IconChip icon={<HiOutlineSparkles className="w-4 h-4" />} tone="brand" />{" "}
        <span className="text-muted">connects patients to the right care by pairing</span>{" "}
        <span className="text-ink font-semibold">AI-powered analysis</span>{" "}
        <IconChip icon={<HiOutlineDocumentText className="w-4 h-4" />} tone="teal" />{" "}
        <span className="text-muted">with verified doctors and real hospitals.</span>
      </p>
    </Reveal>
  );
}

function IconChip({ icon, tone }) {
  const styles = {
    brand: "bg-brand text-white",
    teal: "bg-teal text-white",
  }[tone];

  return (
    <span
      className={`inline-flex w-8 h-8 rounded-full ${styles} items-center justify-center align-middle`}
    >
      {icon}
    </span>
  );
}

/* -------------------------------- Features -------------------------------- */

function Features() {
  const cards = [
    {
      icon: <HiOutlineDocumentText className="w-5 h-5" />,
      tone: "brand",
      title: "AI Report Analysis",
      desc: "Upload any medical report and get a plain-language summary, key findings, and a chat box to ask follow-up questions.",
      mock: <ReportMock />,
    },
    {
      icon: <HiOutlineUserGroup className="w-5 h-5" />,
      tone: "teal",
      title: "Verified Doctor Matching",
      desc: "Search and filter doctors by specialization and experience, then book an appointment directly.",
      mock: <DoctorMock />,
    },
    {
      icon: <HiOutlineBuildingOffice2 className="w-5 h-5" />,
      tone: "amber",
      title: "Hospital Directory",
      desc: "Browse hospitals by location and specialization to find the right facility for your care.",
      mock: <HospitalMock />,
    },
    {
      icon: <HiOutlineBolt className="w-5 h-5" />,
      tone: "coral",
      title: "Emergency Assistance",
      desc: "Describe your symptoms and get an emergency level, immediate actions, and the nearest hospital.",
      mock: <EmergencyMock />,
    },
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 pb-24">
      <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <h2 className="font-display text-4xl font-bold text-ink max-w-lg">
          The Smart Way To Navigate Your Care
        </h2>
        <Link
          to="/register"
          className="inline-flex items-center gap-1.5 text-brand font-semibold hover:text-brand-dark transition"
        >
          Get started
          <HiOutlineArrowRight className="w-4 h-4" />
        </Link>
      </Reveal>

      <div className="relative grid md:grid-cols-2 gap-6">
        <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none z-10">
          <div className="w-16 h-16 rounded-2xl bg-brand shadow-[0_12px_30px_-8px_rgba(36,81,224,0.5)] flex items-center justify-center rotate-6 animate-float-y">
            <HiOutlineSparkles className="w-7 h-7 text-white" />
          </div>
        </div>

        {cards.map((card, index) => (
          <Reveal key={card.title} delay={index * 100}>
            <FeatureCard {...card} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ icon, tone, title, desc, mock }) {
  const iconBg = {
    brand: "bg-brand-light text-brand-dark",
    teal: "bg-teal-light text-teal",
    amber: "bg-amber-light text-amber",
    coral: "bg-coral-light text-coral",
  }[tone];

  return (
    <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm">
      <div
        className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-ink mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-body mb-5">{desc}</p>
      {mock}
    </div>
  );
}

function ReportMock() {
  return (
    <div className="bg-bg-soft rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-ink">
        <HiOutlineChatBubbleLeftRight className="w-4 h-4 text-brand" />
        "What's my hemoglobin level?"
      </div>
      <div className="bg-white rounded-lg px-3 py-2 text-xs text-body">
        Your hemoglobin is 13.2 g/dL — within the normal range.
      </div>
    </div>
  );
}

function DoctorMock() {
  return (
    <div className="bg-bg-soft rounded-xl p-4 space-y-2">
      {["Cardiologist", "Neurologist"].map((spec) => (
        <div
          key={spec}
          className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-xs font-medium text-ink"
        >
          <span className="w-6 h-6 rounded-full bg-teal-light" />
          {spec}
        </div>
      ))}
    </div>
  );
}

function HospitalMock() {
  return (
    <div className="bg-bg-soft rounded-xl p-4 space-y-2 text-xs">
      <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
        <span className="font-medium text-ink">Search by location</span>
        <span className="text-teal font-semibold">Filter</span>
      </div>
      <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
        <span className="font-medium text-ink">Search by specialization</span>
        <span className="text-teal font-semibold">Filter</span>
      </div>
    </div>
  );
}

function EmergencyMock() {
  return (
    <div className="bg-bg-soft rounded-xl p-4 flex items-center justify-between">
      <span className="text-xs font-semibold text-ink">
        Emergency level · Nearest hospital
      </span>
      <span className="bg-coral text-white text-xs font-bold px-3 py-1.5 rounded-full">
        Check Now
      </span>
    </div>
  );
}

/* ------------------------------- Why choose ------------------------------- */

function WhyChoose() {
  return (
    <section id="why-choose" className="max-w-7xl mx-auto px-6 pb-24">
      <Reveal className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="font-display text-4xl font-bold text-ink mb-3">
          Why Choose MedRoute AI?
        </h2>
        <p className="text-body">
          AI-powered matching, a real hospital and doctor directory, and
          honest report analysis — all in one place.
        </p>
      </Reveal>

      <Reveal>
        <WhyChooseRow
          step="01"
          title="Faster Access To Care"
          desc="Search, filter, and book — instead of calling around, MedRoute AI narrows things down for you."
          points={[
            "AI symptom triage in the chat assistant",
            "Search doctors by specialization and experience",
            "Browse hospitals by location and specialization",
            "Emergency assistance with immediate actions",
          ]}
          visual={<CareVisual />}
        />
      </Reveal>

      <Reveal delay={100}>
        <WhyChooseRow
          step="02"
          title="Clarity From Every Report"
          desc="Your report is analyzed once and saved — so you can keep asking questions about it anytime."
          points={[
            "Plain-language summaries and key findings",
            "Ask follow-up questions about your own report",
            "Answers come only from your uploaded report",
            "If it isn't in your report, we say so — never a guess",
          ]}
          visual={<ReportVisual />}
          reverse
        />
      </Reveal>
    </section>
  );
}

function WhyChooseRow({ step, title, desc, points, visual, reverse }) {
  return (
    <div
      className={`grid lg:grid-cols-2 gap-12 items-center mb-16 last:mb-0 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="relative">
        <span className="absolute -top-8 left-0 font-display text-6xl font-bold text-brand-light select-none">
          {step}
        </span>
        {visual}
      </div>

      <div>
        <h3 className="font-display text-2xl font-bold text-ink mb-3">
          {title}
        </h3>
        <p className="text-body mb-6 max-w-md">{desc}</p>

        <ul className="space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <HiOutlineCheckCircle className="w-5 h-5 text-teal shrink-0 mt-0.5" />
              <span className="text-ink font-medium text-sm">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CareVisual() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-ink/5">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
          <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-brand-dark" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">AI Chat</p>
          <p className="text-xs text-muted">Describe your symptoms</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="bg-bg-soft rounded-lg px-3 py-2 text-xs text-body">
          Persistent headache, 3 days, mild fever
        </div>
        <div className="bg-teal-light rounded-lg px-3 py-2 text-xs font-medium text-teal">
          Routed to: General Physician
        </div>
      </div>
    </div>
  );
}

function ReportVisual() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-ink/5">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center">
          <HiOutlineDocumentText className="w-5 h-5 text-teal" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">CBC_Report.pdf</p>
          <p className="text-xs text-muted">Analyzed · ready for questions</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="bg-bg-soft rounded-lg px-3 py-2 text-xs text-body">
          Q: Is my platelet count normal?
        </div>
        <div className="bg-brand-light rounded-lg px-3 py-2 text-xs font-medium text-brand-dark">
          Yes — within the normal range.
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Footer --------------------------------- */

function FooterCta() {
  return (
    <Reveal as="section" className="max-w-7xl mx-auto px-6 pb-24">
      <div className="bg-brand rounded-3xl px-10 py-14 text-center">
        <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
          Ready for care that meets you where you are?
        </h2>
        <p className="text-brand-light/90 max-w-lg mx-auto mb-8">
          Create your free account and get matched with a doctor, hospital,
          or an answer from your own reports.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-white text-brand-dark font-semibold px-7 py-3.5 rounded-full hover:bg-bg-soft hover:scale-[1.03] transition"
        >
          Get Started Free
          <HiOutlineArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Reveal>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink/5">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display font-bold text-ink flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-brand text-white flex items-center justify-center text-xs">
            +
          </span>
          MedRoute AI
        </p>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} MedRoute AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Home;
