import React, { useState } from 'react';
import { useStore, normalizePhone } from '../lib/store';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const { addInquiry, showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiries');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Please provide your full name.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Please provide a valid email address.';
    if (!message.trim() || message.trim().length < 10) newErrors.message = 'Please enter a message (at least 10 characters).';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast('Please complete all required fields.');
      return;
    }

    addInquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() ? '+94 ' + normalizePhone(phone).slice(2) : '+94 Unspecified',
      subject,
      message: message.trim(),
    });

    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full pb-20 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3 pt-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#8B5E3C]">
          GET IN TOUCH
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1F3D2B] tracking-tight">
          We’re Here to Help.
        </h1>
        <p className="text-sm sm:text-base text-[#6B6B6B] max-w-lg mx-auto">
          Have a question about our products, an order or bulk purchasing? We’d be happy to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Contact Info Column */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white border border-[#EADFD0] rounded-2xl p-5 shadow-2xs space-y-4 text-xs text-[#424843]">
            {/* Phone Row - Click to open dialer */}
            <a
              href="tel:+94779443867"
              className="flex items-start gap-3 p-2.5 -mx-1.5 rounded-xl bg-[#FAF8F4] hover:bg-[#F2ECE3] border border-[#EADFD0]/80 transition-all group cursor-pointer"
              title="Click to call Ceylon Crunch"
            >
              <div className="w-8 h-8 rounded-full bg-white group-hover:bg-[#1F3D2B] group-hover:text-white flex items-center justify-center text-[#1F3D2B] shadow-2xs shrink-0 transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-[#1F3D2B] block text-xs">Direct Phone</span>
                <span className="text-xs font-semibold text-[#8B5E3C] group-hover:text-[#1F3D2B] underline decoration-dotted">
                  +94 77 944 3867
                </span>
                <span className="text-[10px] text-[#2E7D4F] block font-medium mt-0.5">
                  ● Tap to call directly
                </span>
              </div>
            </a>

            {/* WhatsApp Row - Click to open WhatsApp */}
            <a
              href="https://wa.me/94779443867?text=Hello%20Ceylon%20Crunch%20Team"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-2.5 -mx-1.5 rounded-xl bg-[#FAF8F4] hover:bg-[#F2ECE3] border border-[#EADFD0]/80 transition-all group cursor-pointer"
              title="Click to chat on WhatsApp"
            >
              <div className="w-8 h-8 rounded-full bg-white group-hover:bg-[#25D366] group-hover:text-white flex items-center justify-center text-[#25D366] shadow-2xs shrink-0 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-[#1F3D2B] block text-xs">WhatsApp</span>
                <span className="text-xs font-semibold text-[#8B5E3C] group-hover:text-[#1F3D2B] underline decoration-dotted">
                  +94 77 944 3867
                </span>
                <span className="text-[10px] text-[#2E7D4F] block font-medium mt-0.5">
                  ● Tap to chat live
                </span>
              </div>
            </a>

            {/* Email Row - Click to open mail client */}
            <a
              href="mailto:ceyloncrunch26@gmail.com"
              className="flex items-start gap-3 p-2.5 -mx-1.5 rounded-xl bg-[#FAF8F4] hover:bg-[#F2ECE3] border border-[#EADFD0]/80 transition-all group cursor-pointer"
              title="Click to send email"
            >
              <div className="w-8 h-8 rounded-full bg-white group-hover:bg-[#1F3D2B] group-hover:text-white flex items-center justify-center text-[#8B5E3C] shadow-2xs shrink-0 transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-[#1F3D2B] block text-xs">Email</span>
                <span className="text-xs font-semibold text-[#8B5E3C] group-hover:text-[#1F3D2B] underline decoration-dotted truncate block">
                  ceyloncrunch26@gmail.com
                </span>
                <span className="text-[10px] text-[#6B6B6B] block mt-0.5">
                  ● Tap to send message
                </span>
              </div>
            </a>

            <div className="pt-2 border-t border-[#EADFD0]/80 space-y-1">
              <span className="font-bold text-[#1F3D2B] block">Hours</span>
              <p className="text-[11px] text-[#6B6B6B]">Monday – Saturday: 9:00 AM – 6:00 PM</p>
              <p className="text-[11px] text-[#6B6B6B]">Sunday: Closed</p>
            </div>

            <div className="pt-2 border-t border-[#EADFD0]/80 space-y-1">
              <span className="font-bold text-[#1F3D2B] block">Social</span>
              <p className="text-[11px] text-[#6B6B6B]">Instagram: @ceyloncrunch</p>
              <p className="text-[11px] text-[#6B6B6B]">Facebook: Ceylon Crunch</p>
            </div>
          </div>

          {/* Quick Direct Action Buttons */}
          <div className="flex flex-col gap-2">
            <a
              href="tel:+94779443867"
              className="w-full py-3 px-4 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us: +94 77 944 3867</span>
            </a>

            <a
              href="https://wa.me/94779443867?text=Hello%20Ceylon%20Crunch%20Team"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-full bg-[#25D366] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs hover:brightness-105 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="md:col-span-2 bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-7 shadow-sm">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">Send a Message</h2>

              {/* Name */}
              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">
                  Full Name <span className="text-[#B3261E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="e.g. Ayesha de Silva"
                  className="w-full h-11 px-3.5 bg-[#f6f3f2] border border-[#EADFD0] rounded-xl text-xs sm:text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                />
                {errors.name && <p className="text-xs text-[#B3261E] mt-0.5">{errors.name}</p>}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1F3D2B] block mb-1">
                    Email Address <span className="text-[#B3261E]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="ayesha@example.com"
                    className="w-full h-11 px-3.5 bg-[#f6f3f2] border border-[#EADFD0] rounded-xl text-xs sm:text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                  />
                  {errors.email && <p className="text-xs text-[#B3261E] mt-0.5">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F3D2B] block mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="077 123 4567"
                    className="w-full h-11 px-3.5 bg-[#f6f3f2] border border-[#EADFD0] rounded-xl text-xs sm:text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">
                  Subject / Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#f6f3f2] border border-[#EADFD0] rounded-xl text-xs sm:text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                >
                  <option value="General Inquiries">General Inquiries</option>
                  <option value="Corporate & Wedding Hampers">Corporate & Wedding Hampers</option>
                  <option value="Order Tracking & Support">Order Tracking & Delivery Support</option>
                  <option value="Wholesale & Culinary Partnership">Wholesale & Culinary Partnership</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">
                  Your Message <span className="text-[#B3261E]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors({ ...errors, message: undefined });
                  }}
                  placeholder="How can we assist with your provisions or celebration requests?"
                  className="w-full p-3 bg-[#f6f3f2] border border-[#EADFD0] rounded-xl text-xs sm:text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B] resize-none"
                />
                {errors.message && <p className="text-xs text-[#B3261E] mt-0.5">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>Send a Message</span>
              </button>
            </form>
          ) : (
            /* Success State */
            <div className="py-8 text-center flex flex-col items-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#c8ebd1] text-[#022111] flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1F3D2B]">
                Inquiry Received!
              </h3>
              <p className="text-xs sm:text-sm text-[#424843] max-w-sm leading-relaxed">
                Thank you, <strong>{name}</strong>. Our Colombo concierge team has received your inquiry regarding <em>{subject}</em> and will follow up shortly via email ({email}).
              </p>
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setEmail('');
                  setPhone('');
                  setMessage('');
                  setIsSubmitted(false);
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#f6f3f2] hover:bg-[#EADFD0] text-[#1F3D2B] text-xs font-semibold transition-colors border border-[#EADFD0]"
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
