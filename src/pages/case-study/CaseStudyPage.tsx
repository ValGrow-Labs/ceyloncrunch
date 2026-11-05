import React, { useEffect } from 'react';
import { CaseStudyNavbar } from './CaseStudyNavbar';
import { CaseStudyHero } from './CaseStudyHero';
import { EditorialCaseStudyView } from './EditorialCaseStudyView';
import { CaseStudyFooter } from './CaseStudyFooter';

export const CaseStudyPage: React.FC = () => {
  useEffect(() => {
    // Set descriptive SEO title and meta description
    document.title = 'Ceylon Crunch Case Study — ValGrow Labs';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore how ValGrow Labs engineered a premium, high-converting D2C e-commerce platform for Ceylon Crunch featuring multi-variant inventory, PayHere payments, and a headless CMS.'
      );
    }
  }, []);

  const handleOpenContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#202820] antialiased selection:bg-[#EADFD0] selection:text-[#1F3D2B] overflow-x-hidden font-sans">
      {/* 01. Minimal Agency Header (Clean, Zero Clutter) */}
      <CaseStudyNavbar onOpenContact={handleOpenContact} />

      <main>
        {/* 02. Editorial Hero */}
        <CaseStudyHero
          onExploreClick={() => {
            const el = document.getElementById('overview');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 03. Editorial Case Study (The Brief, 3 Pillars, Impact & Stack) */}
        <EditorialCaseStudyView onOpenContact={handleOpenContact} />
      </main>

      {/* 04. Minimal Agency Footer */}
      <CaseStudyFooter />
    </div>
  );
};
