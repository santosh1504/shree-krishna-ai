import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Copy, Check, BookOpen, Sparkles, AlertCircle, CheckCircle2, 
  ChevronDown, ChevronUp, Feather, ExternalLink, Heart
} from 'lucide-react';
import { GuidanceResponse } from '../types';

interface GuidanceCardProps {
  guidance: GuidanceResponse;
  userPrompt?: string;
  onSelectFollowUp?: (suggestion: string) => void;
}

export const GuidanceCard: React.FC<GuidanceCardProps> = ({ 
  guidance, 
  userPrompt, 
  onSelectFollowUp 
}) => {
  const [copied, setCopied] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [showHindi, setShowHindi] = useState(false);

  const copyToClipboard = () => {
    const textToCopy = `
SHREE KRISHNA AI — SPIRITUAL GUIDANCE
${guidance.chapterVerse}

${guidance.sanskritShloka}
(${guidance.transliteration})

Translation:
"${guidance.englishTranslation}"

Guidance:
${guidance.everydayExplanation}

Why this applies to your situation:
${guidance.connectionToProblem}

Practical Next Steps:
${guidance.practicalActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Things to Avoid:
${guidance.thingsToAvoid.map((a, i) => `• ${a}`).join('\n')}

Concluding Thought:
${guidance.concludingThought}

Source:
${guidance.sources.scripture}, ${guidance.sources.chapter}, ${guidance.sources.verse} (Translation: ${guidance.sources.translator})
`.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const verseRefMatch = guidance.chapterVerse.match(/Chapter\s+(\d+),\s*Verse\s+(\d+)/i);
  const verseRef = verseRefMatch ? `${verseRefMatch[1]}.${verseRefMatch[2]}` : null;

  return (
    <article className="parchment-card p-6 sm:p-8 md:p-10 space-y-8 animate-fadeIn">
      {/* 1. Warm Acknowledgment & Header */}
      <div className="space-y-4 pb-6 border-b border-[#C5A059]/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#133E2B] flex items-center justify-center text-[#E5C778]">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C6D2D]">
                Spiritual Guidance
              </span>
              <h3 className="font-serif-title text-lg font-bold text-[#133E2B]">
                Compassionate Reflection
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#4D5A53] hover:text-[#133E2B] hover:bg-[#F2ECE0] border border-[#C5A059]/30 transition-all focus:outline-none"
              title="Copy complete spiritual guidance"
              aria-label="Copy guidance"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#133E2B]" />
                  <span className="text-[#133E2B] font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8C6D2D]" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* User Prompt (if present) */}
        {userPrompt && (
          <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#C5A059]/15 text-sm text-[#4D5A53] italic">
            <span className="font-semibold text-[#8C6D2D] not-italic mr-1.5">Your Reflection:</span>
            "{userPrompt}"
          </div>
        )}

        {/* Step 1: Warm Acknowledgment */}
        <p className="text-[#2C3530] text-base sm:text-lg leading-relaxed font-serif-title italic bg-[#FBF9F4] p-4 rounded-xl border-l-4 border-[#C5A059]">
          {guidance.acknowledgment}
        </p>
      </div>

      {/* 2, 3, 4, 5. Sacred Sanskrit Shloka Box */}
      <section className="shloka-box p-6 sm:p-7 space-y-4 shadow-sm" aria-label="Bhagavad Gita Verse">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C5A059]/25 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#133E2B] text-[#FAF8F5] text-xs font-semibold tracking-wide shadow-sm">
              {guidance.chapterVerse}
            </span>
            <span className="text-xs text-[#8C6D2D] font-serif-title italic">
              Verified Scripture
            </span>
          </div>

          {verseRef && (
            <Link
              to={`/verses?ref=${verseRef}`}
              className="inline-flex items-center gap-1 text-xs text-[#133E2B] hover:text-[#0B2418] font-medium hover:underline"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#8C6D2D]" />
              <span>Explore in Gita Index</span>
            </Link>
          )}
        </div>

        {/* Step 2: Sanskrit Devanagari */}
        <div className="py-2 text-center sm:text-left">
          <p className="font-sanskrit text-xl sm:text-2xl text-[#0E2E1F] font-bold leading-relaxed tracking-wide">
            {guidance.sanskritShloka}
          </p>
        </div>

        {/* Step 4: Transliteration */}
        {guidance.transliteration && (
          <div className="text-xs sm:text-sm text-[#61523E] font-serif-title italic border-t border-[#C5A059]/15 pt-3">
            <span className="font-semibold text-[#8C6D2D] not-italic mr-2">Pronunciation:</span>
            {guidance.transliteration}
          </div>
        )}

        {/* Step 5: Simple English Translation */}
        <div className="bg-[#FFFFFF]/90 p-4 rounded-xl border border-[#C5A059]/30 text-[#133E2B] space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C6D2D] block">
            English Translation ({guidance.sources?.translator || 'Swami Sivananda'})
          </span>
          <p className="text-base sm:text-lg font-serif-title font-medium leading-relaxed italic">
            "{guidance.englishTranslation}"
          </p>
        </div>
      </section>

      {/* 6. Everyday Language Explanation */}
      <section className="space-y-3" aria-label="Everyday Explanation">
        <h4 className="font-display text-sm uppercase tracking-wider text-[#8C6D2D] font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>Understanding the Teaching</span>
        </h4>
        <div className="prose prose-stone max-w-none text-base sm:text-lg text-[#2E3833] leading-relaxed space-y-4 font-serif-title whitespace-pre-line">
          {guidance.everydayExplanation}
        </div>
      </section>

      {/* 7. Why this relates to the user's specific problem */}
      <section className="bg-[#FAF6EE] p-5 sm:p-6 rounded-2xl border border-[#C5A059]/25 space-y-3" aria-label="Relation to your problem">
        <h4 className="font-display text-sm uppercase tracking-wider text-[#133E2B] font-bold flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#8C6D2D]" />
          <span>Why This Speaks to Your Situation</span>
        </h4>
        <p className="text-base text-[#38433D] leading-relaxed font-serif-title">
          {guidance.connectionToProblem}
        </p>
      </section>

      {/* 8 & 9. Practical Next Steps & Things to Avoid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Step 8: What You Can Practically Do Next */}
        <section className="bg-[#F6FAF7] p-5 sm:p-6 rounded-2xl border border-[#1E4E38]/20 space-y-3" aria-label="Practical Actions">
          <h4 className="font-display text-xs sm:text-sm uppercase tracking-wider text-[#133E2B] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1E4E38]" />
            <span>Practical Actions for Today</span>
          </h4>
          <ul className="space-y-3 text-sm text-[#24332B]">
            {guidance.practicalActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#133E2B] text-[#FAF8F5] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Step 9: What You Should Avoid and Why */}
        <section className="bg-[#FCF7F4] p-5 sm:p-6 rounded-2xl border border-[#B97A57]/20 space-y-3" aria-label="Pitfalls to Avoid">
          <h4 className="font-display text-xs sm:text-sm uppercase tracking-wider text-[#8A4828] font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#B97A57]" />
            <span>Pitfalls to Avoid</span>
          </h4>
          <ul className="space-y-3 text-sm text-[#4D2E1E]">
            {guidance.thingsToAvoid.map((avoidance, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8A4828]/15 text-[#8A4828] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  ✕
                </span>
                <span className="leading-relaxed">{avoidance}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 10. Concluding Thought / Blessing */}
      <section className="text-center py-6 px-4 bg-gradient-to-r from-[#FBF9F4] via-[#F6F0E4] to-[#FBF9F4] rounded-2xl border border-[#C5A059]/30 space-y-2" aria-label="Concluding Thought">
        <Feather className="w-6 h-6 text-[#C5A059] mx-auto opacity-80" />
        <p className="font-serif-title italic text-base sm:text-lg text-[#133E2B] font-medium max-w-2xl mx-auto leading-relaxed">
          "{guidance.concludingThought}"
        </p>
      </section>

      {/* 11. Verifiable Sources (Expandable) */}
      <section className="border-t border-[#C5A059]/20 pt-4">
        <button
          type="button"
          onClick={() => setSourcesOpen(!sourcesOpen)}
          className="w-full flex items-center justify-between text-xs text-[#6B7972] hover:text-[#133E2B] py-2 focus:outline-none transition-colors"
          aria-expanded={sourcesOpen}
        >
          <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#8C6D2D]" />
            <span>Scriptural Sources & Authentication Details</span>
          </span>
          {sourcesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {sourcesOpen && (
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#C5A059]/20 text-xs text-[#505F57] space-y-2 mt-2 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <strong className="text-[#133E2B]">Scripture:</strong> {guidance.sources?.scripture || 'Shrimad Bhagavad Gita'}
              </div>
              <div>
                <strong className="text-[#133E2B]">Citation:</strong> {guidance.sources?.chapter}, {guidance.sources?.verse}
              </div>
              <div>
                <strong className="text-[#133E2B]">Translator:</strong> {guidance.sources?.translator || 'Swami Sivananda'}
              </div>
              <div>
                <strong className="text-[#133E2B]">Provenance:</strong> Critical Sanskrit Recension (Mahabharata, Bhishma Parva)
              </div>
            </div>
            {guidance.sources?.historicalNote && (
              <p className="text-[#6D7B74] pt-2 border-t border-[#C5A059]/15 italic">
                {guidance.sources.historicalNote}
              </p>
            )}
            <div className="pt-1 text-[11px] text-[#8C6D2D]">
              Synthesis Engine: {guidance.providerDisclosed}
            </div>
          </div>
        )}
      </section>

      {/* Contextual Follow-Up Suggestions */}
      {guidance.followUpSuggestions && guidance.followUpSuggestions.length > 0 && onSelectFollowUp && (
        <section className="pt-4 border-t border-[#C5A059]/20 space-y-3" aria-label="Suggested Follow-ups">
          <span className="text-xs uppercase tracking-wider font-bold text-[#8C6D2D] block">
            Continue the Conversation — Deepen Your Reflection
          </span>
          <div className="flex flex-wrap gap-2">
            {guidance.followUpSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectFollowUp(suggestion)}
                className="text-left text-xs sm:text-sm bg-[#FFFFFF] hover:bg-[#F4ECE0] text-[#133E2B] px-3.5 py-2 rounded-full border border-[#C5A059]/35 hover:border-[#C5A059] transition-all shadow-xs flex items-center gap-2 group focus:outline-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform shrink-0" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
