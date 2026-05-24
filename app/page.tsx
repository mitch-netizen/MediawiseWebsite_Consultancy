"use client";

import React, { useEffect, useState } from "react";

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track custom cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <div
        className="progress-bar"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Custom Cursor */}
      <div
        className="custom-cursor"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      ></div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-[rgba(34,52,71,0.95)] backdrop-blur-[10px] z-50 border-b border-[rgba(2,216,190,0.15)]">
        <nav className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
          <a href="#" className="font-display text-2xl font-bold text-teal">
            MEDIAWISE
          </a>
          <div className="flex gap-8 list-none">
            <a
              href="#about"
              className="text-white text-sm font-medium uppercase tracking-wider hover:text-teal transition-colors"
            >
              About
            </a>
            <a
              href="#services"
              className="text-white text-sm font-medium uppercase tracking-wider hover:text-teal transition-colors"
            >
              Services
            </a>
            <a
              href="#contact"
              className="text-white text-sm font-medium uppercase tracking-wider hover:text-teal transition-colors"
            >
              Contact
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section
          id="hero"
          className="min-h-screen flex items-center pt-24 px-8"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-6xl font-bold font-display mb-6 animate-fadeUp uppercase text-white">
              Revenue Strategy <span className="text-teal">That Moves</span>
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto mb-8 animate-fadeUp leading-relaxed">
              I help regional and growth-stage businesses build marketing strategy, grow revenue, and fix the systems holding them back — without the cost of a full-time executive.
            </p>
            <button className="btn btn-primary">WORK WITH ME</button>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold font-display mb-12 text-white uppercase">
              A Decade of Execution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-lg text-white leading-relaxed mb-6">
                  I'm not a consultant who advises from the sidelines. I work <span className="text-teal font-bold">embedded inside your business</span>, owning outcomes and reporting directly to you.
                </p>
                <p className="text-lg text-white leading-relaxed mb-6">
                  With a decade running real revenue functions, I've built campaign strategies, performance systems, and teams that deliver measurable results. I focus on what actually works in commercial reality, not what looks good in frameworks.
                </p>
              </div>
              <div>
                <div className="space-y-4">
                  <div className="border-l-4 border-teal pl-6 py-2">
                    <p className="text-lg font-bold text-teal">Strategy + Execution</p>
                    <p className="text-white">Revenue strategy isn't a PowerPoint deck—it's embedded execution turning insight into repeatable systems.</p>
                  </div>
                  <div className="border-l-4 border-teal pl-6 py-2">
                    <p className="text-lg font-bold text-teal">Systems-Based Approach</p>
                    <p className="text-white">Most businesses leak time through broken processes. I design automation and workflows that actually get used.</p>
                  </div>
                  <div className="border-l-4 border-teal pl-6 py-2">
                    <p className="text-lg font-bold text-teal">Regional Expertise</p>
                    <p className="text-white">Based in Central Queensland. Working with clients across Australia. Direct, honest, and focused on outcomes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold font-display mb-12 text-white uppercase">
              Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Embedded Marketing Leadership",
                  desc: "Strategy, campaigns, and team leadership embedded in your business."
                },
                {
                  title: "Revenue Growth Consulting",
                  desc: "Sales systems, pipeline management, and forecasting for consistent growth."
                },
                {
                  title: "Workflow & Systems Design",
                  desc: "Salesforce, Power Automate, and Smartsheet automation that actually gets used."
                },
                {
                  title: "Marketing Strategy",
                  desc: "Brand positioning, digital strategy, and campaign architecture."
                },
                {
                  title: "Sales Team Development",
                  desc: "Coaching, onboarding, and performance systems for high-performing teams."
                },
                {
                  title: "Business Improvement",
                  desc: "Process optimization, change management, and operational efficiency."
                }
              ].map((service, i) => (
                <div key={i} className="card border-teal/30 hover:border-teal">
                  <h3 className="text-lg font-bold mb-4 text-white uppercase">{service.title}</h3>
                  <p className="text-white">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-5xl font-bold font-display mb-8 text-white uppercase">
              Let's Talk Strategy
            </h2>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto leading-relaxed">
              Whether you're looking to build marketing strategy, grow revenue, or fix broken systems, I'll give you straight talk on what'll actually work for your business.
            </p>
            <div className="space-y-4">
              <button className="btn btn-primary">START A CONVERSATION</button>
              <p className="text-sm text-white/70">
                Response within one business day. No obligation, no jargon.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-navy border-t border-teal/20 py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-teal font-bold mb-4">Mitch Harris</h3>
              <p className="text-white text-sm">Marketing & Revenue Strategist</p>
              <p className="text-white/70 text-sm">Central Queensland, Australia</p>
            </div>
            <div>
              <h3 className="text-teal font-bold mb-4">Contact</h3>
              <p className="text-white text-sm">Email: mitch.harris@outlook.com.au</p>
              <p className="text-white text-sm">Phone: +61 409 265 711</p>
            </div>
            <div>
              <h3 className="text-teal font-bold mb-4">Connect</h3>
              <p className="text-white text-sm">LinkedIn: linkedin.com/in/mitch-harris-consultant</p>
              <p className="text-white/70 text-sm">Australia-wide service</p>
            </div>
          </div>
          <div className="border-t border-teal/20 pt-8 text-center">
            <p className="text-white text-sm">
              © 2026 Mitch Harris - Mediawise Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
