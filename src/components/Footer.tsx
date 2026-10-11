import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Heart, Shield, BookOpen, Compass, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F5EFE4] border-t border-[#C5A059]/30 pt-16 pb-12 text-[#3D4741]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sacred Shloka Banner */}
        <div className="text-center pb-12 border-b border-[#C5A059]/20">
          <p className="font-sanskrit text-xl sm:text-2xl text-[#133E2B] font-semibold tracking-wide">
            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
          </p>
          <p className="text-xs sm:text-sm text-[#8C6D2D] font-serif-title italic mt-2">
            "Your sacred right is to the sincere effort alone, never to the fruits thereof." — Bhagavad Gita 2.47
          </p>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#133E2B] flex items-center justify-center border border-[#C5A059]/40">
                <Feather className="w-4 h-4 text-[#E5C778]" />
              </div>
              <span className="font-display text-xl font-bold text-[#133E2B]">
                Shree Krishna AI
              </span>
            </div>
            <p className="text-sm text-[#505D56] leading-relaxed max-w-md">
              A peaceful sanctuary where anyone can bring personal burdens and receive compassionate, 
              grounded guidance inspired by the timeless wisdom of Shree Krishna in the Shrimad Bhagavad Gita.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#707D76]">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#1E4E38]" /> No login required
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#8C6D2D]" /> 100% Free
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#1E4E38]" /> 701 Verified Verses
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="font-display text-xs uppercase tracking-wider text-[#8C6D2D] font-bold">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-[#133E2B] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/guidance" className="hover:text-[#133E2B] transition-colors">
                  Spiritual Guidance
                </Link>
              </li>
              <li>
                <Link to="/verses" className="hover:text-[#133E2B] transition-colors">
                  Bhagavad Gita Explorer
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#133E2B] transition-colors">
                  About & Purpose
                </Link>
              </li>
            </ul>
          </div>

          {/* Ethics & Scripture */}
          <div className="space-y-3">
            <h3 className="font-display text-xs uppercase tracking-wider text-[#8C6D2D] font-bold">
              Ethics & Sources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sources" className="hover:text-[#133E2B] transition-colors">
                  Scriptural Sources & Provenance
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#133E2B] transition-colors">
                  Privacy Policy & Data Handling
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/praneshp1org/Bhagavad-Gita-JSON-data" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#505D56] hover:text-[#133E2B] transition-colors"
                >
                  <span>Open Gita Dataset</span>
                  <ExternalLink className="w-3 h-3 text-[#8C6D2D]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Disclaimer */}
        <div className="pt-8 border-t border-[#C5A059]/20 text-xs text-[#6B7871] space-y-3">
          <p className="leading-relaxed">
            <strong className="text-[#3D4741]">Spiritual Counseling & Ethical Boundary Notice:</strong> Shree Krishna AI is an artificial intelligence counseling companion developed to make the philosophical and spiritual teachings of the Bhagavad Gita accessible for everyday life reflection. It does not possess divine consciousness, omniscience, or supernatural authority. It is not an alternative to licensed clinical therapy, psychiatric treatment, or crisis intervention. If you are experiencing overwhelming emotional distress or suicidal ideation, please seek immediate assistance from a local crisis lifeline (such as 988 in the US/Canada or 112 in India and the EU).
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-[#7B8881]">
            <p>© {new Date().getFullYear()} Shree Krishna AI. Crafted with reverence and care.</p>
            <p className="text-[11px]">Grounding verified against authentic Sanskrit critical editions.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
