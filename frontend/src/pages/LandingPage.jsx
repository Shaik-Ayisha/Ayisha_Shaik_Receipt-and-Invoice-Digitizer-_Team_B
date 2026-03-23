import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-black text-white scroll-smooth">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6">

        <h1 className="text-xl font-bold tracking-wide">
          Receipt&InvoiceDigitizer
        </h1>

        <div className="flex gap-8 items-center">

          <a href="#features" className="opacity-80 hover:opacity-100 cursor-pointer">
            Features
          </a>

          <a href="#solutions" className="opacity-80 hover:opacity-100 cursor-pointer">
            Solutions
          </a>

          <a href="#blog" className="opacity-80 hover:opacity-100 cursor-pointer">
            Blog
          </a>

          <Link
            to="/login"
            className="bg-white text-black px-4 py-2 rounded-full font-semibold"
          >
            Log In
          </Link>

        </div>

      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between px-12 py-20">

        {/* LEFT TEXT */}
        <div className="max-w-xl">

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Digitize Your <br />

            <span className="text-purple-300">
              Receipts & Invoices
            </span>

            <br />

            in Seconds
          </h1>

          <p className="text-lg opacity-80 mb-8">
            Upload receipts, extract data using OCR, and manage
            your expenses with powerful analytics and AI tools.
          </p>

          <Link
            to="/login"
            className="bg-black border border-purple-400 px-6 py-3 rounded-full hover:bg-purple-600 transition"
          >
            Start Now →
          </Link>

        </div>

        {/* RIGHT VISUAL */}
        <div className="relative mt-16 md:mt-0">

          <div className="w-64 h-64 rounded-full border border-purple-500 flex items-center justify-center text-3xl font-bold">
            20k+
            <span className="block text-sm opacity-70 ml-2">
              Documents
            </span>
          </div>

          <div className="absolute -top-8 left-10 bg-purple-600 p-3 rounded-xl shadow-lg">
            📄
          </div>

          <div className="absolute top-10 -right-8 bg-indigo-600 p-3 rounded-xl shadow-lg">
            📊
          </div>

          <div className="absolute bottom-10 -left-10 bg-pink-600 p-3 rounded-xl shadow-lg">
            🤖
          </div>

          <div className="absolute bottom-0 right-0 bg-blue-600 p-3 rounded-xl shadow-lg">
            🧾
          </div>

        </div>

      </section>

      {/* LOGO STRIP */}
      <div className="flex justify-center gap-16 opacity-50 pb-16 text-sm">
        <span>Dreamure</span>
        <span>Switch.win</span>
        <span>Sphere</span>
        <span>PinSpace</span>
        <span>Visionix</span>
      </div>

      {/* FEATURES */}
      <section id="features" className="px-12 py-20 text-center">

        <h2 className="text-4xl font-bold mb-12">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-white/10 p-6 rounded-xl backdrop-blur">
            <h3 className="text-xl font-semibold mb-3">📄 OCR Extraction</h3>
            <p className="opacity-70">
              Automatically extract invoice data using AI powered OCR.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl backdrop-blur">
            <h3 className="text-xl font-semibold mb-3">📊 Smart Analytics</h3>
            <p className="opacity-70">
              Track spending patterns and generate expense insights.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl backdrop-blur">
            <h3 className="text-xl font-semibold mb-3">☁️ Secure Storage</h3>
            <p className="opacity-70">
              Store and organize all receipts safely in one place.
            </p>
          </div>

        </div>

      </section>

      {/* SOLUTIONS */}
      <section id="solutions" className="px-12 py-20 text-center bg-black/20">

        <h2 className="text-4xl font-bold mb-12">
          Who Is This For?
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <h3 className="text-xl font-semibold mb-3">Freelancers</h3>
            <p className="opacity-70">
              Manage invoices and track expenses easily.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Small Businesses</h3>
            <p className="opacity-70">
              Digitize accounting workflows with automation.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Finance Teams</h3>
            <p className="opacity-70">
              Organize and audit financial records instantly.
            </p>
          </div>

        </div>

      </section>

      {/* TESTIMONIALS */}
      <section className="px-12 py-20 text-center">

        <h2 className="text-4xl font-bold mb-12">
          What Our Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-white/10 p-6 rounded-xl">
            <p className="opacity-80">
              "This tool saved our accounting team hours every week."
            </p>
            <h4 className="mt-4 font-semibold">
              — Sarah, Startup Founder
            </h4>
          </div>

          <div className="bg-white/10 p-6 rounded-xl">
            <p className="opacity-80">
              "OCR extraction works surprisingly well. Very useful!"
            </p>
            <h4 className="mt-4 font-semibold">
              — Michael, Freelancer
            </h4>
          </div>

          <div className="bg-white/10 p-6 rounded-xl">
            <p className="opacity-80">
              "Our finance workflow became fully digital."
            </p>
            <h4 className="mt-4 font-semibold">
              — Anita, Finance Manager
            </h4>
          </div>

        </div>

      </section>

      {/* BLOG */}
      <section id="blog" className="px-12 py-20 bg-black/20 text-center">

        <h2 className="text-4xl font-bold mb-12">
          Latest Blog
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-white/10 p-6 rounded-xl">
            <h3 className="font-semibold mb-3">
              How OCR Improves Expense Tracking
            </h3>
            <p className="opacity-70 text-sm">
              Learn how AI can automate invoice management.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl">
            <h3 className="font-semibold mb-3">
              Digitizing Business Receipts
            </h3>
            <p className="opacity-70 text-sm">
              Why companies are moving away from paper receipts.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl">
            <h3 className="font-semibold mb-3">
              Expense Management Guide
            </h3>
            <p className="opacity-70 text-sm">
              Best practices for tracking expenses efficiently.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="text-center py-20">

        <h2 className="text-4xl font-bold mb-6">
          Start Digitizing Your Receipts Today
        </h2>

        <Link
          to="/login"
          className="bg-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-700 transition"
        >
          Get Started
        </Link>

      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 opacity-60 text-sm">
        © 2026 ReceiptDigitizer • Privacy • Terms • Contact
      </footer>

    </div>
  );
}