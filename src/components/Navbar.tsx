import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, BookOpen, Shield, Info, Sparkles, Menu, X, Feather } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/guidance', label: 'Seek Guidance', icon: Sparkles },
    { to: '/verses', label: 'Gita Explorer', icon: BookOpen },
    { to: '/about', label: 'About', icon: Info },
    { to: '/sources', label: 'Sources', icon: Compass },
    { to: '/privacy', label: 'Privacy', icon: Shield },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#C5A059]/20 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link 
          to="/" 
          className="flex items-center gap-3.5 group focus:outline-none"
          aria-label="Shree Krishna AI Home"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1E4E38] to-[#0D281C] border border-[#C5A059]/40 flex items-center justify-center shadow-sm group-hover:border-[#C5A059] group-hover:scale-105 transition-all">
            <Feather className="w-5 h-5 text-[#E5C778]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl sm:text-2xl font-bold tracking-wide text-[#133E2B] group-hover:text-[#0D281C] transition-colors">
              Shree Krishna AI
            </span>
            <span className="text-[11px] tracking-wider uppercase font-medium text-[#8C6D2D]">
              Spiritual Wisdom • Bhagavad Gita
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#133E2B] text-[#FAF8F5] shadow-sm'
                    : 'text-[#3E4A43] hover:text-[#133E2B] hover:bg-[#EFE9DC]/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/guidance"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#133E2B] to-[#1E4E38] text-[#FAF8F5] text-sm font-medium hover:from-[#0D281C] hover:to-[#16402E] shadow-sm hover:shadow transition-all border border-[#C5A059]/30"
          >
            <Sparkles className="w-4 h-4 text-[#E5C778]" />
            <span>Consult the Gita</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#133E2B] hover:bg-[#EFE9DC] focus:outline-none"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#C5A059]/30 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  active
                    ? 'bg-[#133E2B] text-[#FAF8F5]'
                    : 'text-[#3E4A43] hover:bg-[#EFE9DC]'
                }`}
              >
                {Icon && <Icon className="w-5 h-5 text-[#C5A059]" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-3">
            <Link
              to="/guidance"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#133E2B] text-[#FAF8F5] font-medium shadow"
            >
              <Sparkles className="w-4 h-4 text-[#E5C778]" />
              <span>Consult the Gita</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
