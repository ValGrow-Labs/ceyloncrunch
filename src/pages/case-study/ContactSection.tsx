import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Send, CheckCircle2, Mail, MapPin } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>(['D2C E-Commerce']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const services = [
    'D2C E-Commerce',
    'Custom Headless CMS',
    'Full-Stack Web Applications',
    'UI/UX Design Systems',
    'Payment & API Integrations',
    'AI-Powered Business Operations',
  ];

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#FBF7F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading & Value Proposition (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
              16 // Partner with ValGrow Labs
            </div>

            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-medium text-[#1F3D2B] tracking-[-0.035em] leading-[1.0]">
              Have a Vision? <br />
              <span className="italic font-normal text-[#8B5E3C] pr-1">Let's Build</span> It.
            </h2>

            <p className="font-serif italic text-lg sm:text-2xl text-[#8B5E3C] leading-snug tracking-[-0.01em] font-normal">
              From ambitious ideas to intelligent digital products, ValGrow Labs helps businesses turn possibilities into working solutions.
            </p>

            <p className="text-xs sm:text-sm text-[#202820]/80 leading-relaxed font-sans">
              Whether you are scaling an artisanal direct-to-consumer brand, modernizing complex manual operations, or engineering bespoke software systems, we partner with founders to build durable digital platforms.
            </p>

            {/* Agency Contact Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#EADFD0] space-y-3 shadow-2xs font-sans text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-[#EADFD0]">
                <img
                  src="/valgrow-logo.png"
                  alt="ValGrow Labs Logo"
                  className="h-7 w-auto object-contain"
                />
                <span className="font-serif font-bold text-base text-[#1F3D2B]">ValGrow Labs</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#1F3D2B]">
                <MapPin className="w-4 h-4 text-[#8B5E3C]" />
                <span className="font-medium">ValGrow Labs · Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#1F3D2B]">
                <Mail className="w-4 h-4 text-[#8B5E3C]" />
                <span className="font-mono">hello@valgrowlabs.com</span>
              </div>
            </div>
          </div>

          {/* Right Column: Project Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFD0] shadow-[0_16px_40px_rgba(31,61,43,0.06)]">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#2E7D4F]/10 text-[#2E7D4F] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#1F3D2B]">
                    Inquiry Received
                  </h4>
                  <p className="text-xs sm:text-sm text-[#202820]/80 max-w-md mx-auto font-sans leading-relaxed">
                    Thank you for reaching out to ValGrow Labs. Our engineering leadership will review your project requirements and respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-2.5">
                      What capabilities are you looking for?
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {services.map((s) => {
                        const isSelected = selectedServices.includes(s);
                        return (
                          <button
                            type="button"
                            key={s}
                            onClick={() => toggleService(s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#1F3D2B] text-white font-medium shadow-2xs'
                                : 'bg-[#FAF6EF] text-[#202820] border border-[#EADFD0] hover:bg-white'
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ruwan Wickramasinghe"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD0] bg-[#FAF6EF]/50 text-xs text-[#202820] focus:outline-none focus:border-[#1F3D2B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ruwan@company.lk"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD0] bg-[#FAF6EF]/50 text-xs text-[#202820] focus:outline-none focus:border-[#1F3D2B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F3D2B] mb-1 font-sans">
                      Brief Project Overview
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your brand, current bottlenecks, and target launch timeline..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD0] bg-[#FAF6EF]/50 text-xs text-[#202820] font-sans focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <span className="text-[11px] text-[#8B5E3C] font-mono">
                      NDA protected · Direct partner response
                    </span>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold shadow-md flex items-center gap-2 cursor-pointer transition-all transform hover:-translate-y-0.5"
                    >
                      <span>Submit Project Inquiry</span>
                      <Send className="w-3.5 h-3.5 text-[#D9A441]" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
