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
      <header className="fixed top-0 left-0 right-0 bg-[rgba(16,24,32,0.95)] backdrop-blur-[10px] z-50 border-b border-[rgba(216,195,138,0.1)]">
        <nav className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
          <a href="#" className="font-display text-2xl font-bold text-gold">
            MEDIAWISE
          </a>
          <div className="flex gap-8 list-none">
            <a
              href="#about"
              className="text-off-white text-sm font-medium uppercase tracking-wider hover:text-gold transition-colors"
            >
              About
            </a>
            <a
              href="#services"
              className="text-off-white text-sm font-medium uppercase tracking-wider hover:text-gold transition-colors"
            >
              Services
            </a>
            <a
              href="#contact"
              className="text-off-white text-sm font-medium uppercase tracking-wider hover:text-gold transition-colors"
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
            <h1 className="text-5xl font-bold font-display mb-6 animate-fadeUp">
              Marketing & Revenue <span className="text-gold">Strategy</span>
            </h1>
            <p className="text-xl text-off-white max-w-2xl mx-auto mb-8 animate-fadeUp">
              Transforming businesses through strategic marketing and proven
              revenue generation methods.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-8 bg-navy-mid">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold font-display mb-8 text-gold">
              About
            </h2>
            <p className="text-lg text-off-white leading-relaxed max-w-3xl">
              With years of experience in marketing strategy and business
              growth, I help companies unlock their revenue potential through
              data-driven insights and strategic planning.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold font-display mb-12 text-gold">
              Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {["Strategy", "Growth", "Optimization", "Analytics", "Planning", "Execution"].map(
                (service, i) => (
                  <div key={i} className="card">
                    <h3 className="text-xl font-bold mb-4">{service}</h3>
                    <p className="text-off-white">
                      Professional service offerings designed for business
                      growth.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-8 bg-navy-mid">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold font-display mb-8 text-gold">
              Let's Work Together
            </h2>
            <p className="text-lg text-off-white mb-8 max-w-2xl mx-auto">
              Ready to transform your business? Get in touch and let's discuss
              your marketing strategy.
            </p>
            <button className="btn btn-secondary">Contact Me</button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-navy-mid border-t border-[rgba(216,195,138,0.1)] py-12 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-off-white text-sm">
            © 2024 Mitch Harris. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
