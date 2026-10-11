import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Verse } from '../types';

interface VerseCardProps {
  verse: Verse;
  featured?: boolean;
}

export const VerseCard: React.FC<VerseCardProps> = ({ verse, featured = false }) => {
  const [copied, setCopied] = useState(false);
  const [showMeanings, setShowMeanings] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    const text = `Bhagavad Gita ${verse.citation}\n\n${verse.slok}\n(${verse.transliteration})\n\n"${verse.translation_english}" — ${verse.translator_english}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConsult = () => {
    navigate(`/guidance?prompt=${encodeURIComponent(`How can I apply Bhagavad Gita ${verse.citation} ("${verse.translation_english.slice(0, 100)}...") in my personal life?`)}`);
  };

  return (
    <div className={`parchment-card p-6 sm:p-7 space-y-4 ${featured ? 'border-[#C5A059]/60 shadow-md bg-gradient-to-br from-[#FFFFFF] to-[#FAF6EE]' : ''}`}>
      {/* Top Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C5A059]/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#133E2B] text-[#FAF8F5] text-xs font-semibold tracking-wide">
            {verse.citation}
          </span>
          {featured && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D2D] bg-[#F6F0E4] px-2 py-0.5 rounded-md">
              Verse of the Day
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-[#55635C] hover:text-[#133E2B] hover:bg-[#F2ECE0] transition-colors focus:outline-none"
            title="Copy verse"
            aria-label="Copy verse text"
          >
            {copied ? <Check className="w-4 h-4 text-[#133E2B]" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleConsult}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F6F0E4] text-[#133E2B] hover:bg-[#133E2B] hover:text-[#FAF8F5] transition-all border border-[#C5A059]/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Reflect with AI</span>
          </button>
        </div>
      </div>

      {/* Sanskrit Shloka */}
      <div className="py-2 text-center sm:text-left">
        <p className="font-sanskrit text-lg sm:text-xl text-[#0E2E1F] font-bold leading-relaxed">
          {verse.slok}
        </p>
      </div>

      {/* Transliteration */}
      {verse.transliteration && (
        <p className="text-xs sm:text-sm text-[#61523E] font-serif-title italic">
          {verse.transliteration}
        </p>
      )}

      {/* Translation */}
      <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#C5A059]/20 space-y-1">
        <p className="font-serif-title text-base sm:text-lg text-[#1F2622] leading-relaxed">
          "{verse.translation_english}"
        </p>
        <span className="text-[11px] text-[#8C6D2D] block font-medium">
          — Translation by {verse.translator_english || 'Swami Sivananda'}
        </span>
      </div>

      {/* Word-by-Word Meanings toggle */}
      {verse.word_meanings && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowMeanings(!showMeanings)}
            className="text-xs text-[#8C6D2D] hover:text-[#133E2B] font-semibold flex items-center gap-1 focus:outline-none"
          >
            <span>Word-by-word Sanskrit breakdown</span>
            {showMeanings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showMeanings && (
            <div className="mt-2 p-3 bg-[#FFFFFF] rounded-lg border border-[#C5A059]/20 text-xs text-[#525F58] leading-relaxed font-serif-title animate-fadeIn">
              {verse.word_meanings}
            </div>
          )}
        </div>
      )}

      {/* Themes */}
      {verse.themes && verse.themes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {verse.themes.map((theme, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-[#F2ECE0] text-[#55635C] px-2.5 py-0.5 rounded-full capitalize"
            >
              {theme.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
