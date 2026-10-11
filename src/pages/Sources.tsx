import React from 'react';
import { BookOpen, Compass, ExternalLink, Shield, CheckCircle2, Feather } from 'lucide-react';

export const Sources: React.FC = () => {
  const translators = [
    {
      name: "Swami Sivananda (1887–1963)",
      institution: "The Divine Life Society, Rishikesh",
      language: "English",
      description: "Renowned spiritual luminary whose literal, verse-by-verse translation and lucid spiritual commentary provide the primary English foundation for our dataset."
    },
    {
      name: "Swami Gambhirananda (1899–1988)",
      institution: "Advaita Ashrama, Ramakrishna Math",
      language: "English",
      description: "Rigorous scholarly translation closely following the classical non-dual (Advaita) commentary of Adi Shankaracharya."
    },
    {
      name: "Swami Adidevananda (1912–1983)",
      institution: "Sri Ramakrishna Math",
      language: "English",
      description: "Distinguished Sanskrit scholar known for his authoritative English rendering of the Bhagavad Gita based on the Vishishtadvaita commentary of Sri Ramanujacharya."
    },
    {
      name: "Swami Ramsukhdas (1904–2005)",
      institution: "Gita Press, Gorakhpur",
      language: "Hindi",
      description: "Revered author of the monumental 'Sadhak Sanjivani' Hindi commentary, emphasizing practical self-surrender, duty, and spiritual solace for everyday people."
    },
    {
      name: "Shri Purohit Swami (1882–1941)",
      institution: "Independent Traditional Scholar",
      language: "English",
      description: "Poetic translation celebrated for bringing the flow and devotional dignity of the Sanskrit verse into natural English cadence."
    },
    {
      name: "Swami Tejomayananda",
      institution: "Chinmaya Mission",
      language: "Hindi / English",
      description: "Clear, systematic discourses and translations emphasizing the practical application of Vedanta in modern family and work life."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F0E4] border border-[#C5A059]/35 text-[#8C6D2D] text-xs font-semibold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Scriptural Provenance</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#133E2B]">
          Scriptural Sources & Provenance
        </h1>
        <p className="text-base sm:text-xl text-[#4D5C54] font-serif-title max-w-2xl mx-auto leading-relaxed">
          Full transparency on the scriptures, Sanskrit editions, translators, and data provenance used in Shree Krishna AI.
        </p>
      </div>

      {/* Critical Scripture Foundation */}
      <div className="parchment-card p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#133E2B] flex items-center justify-center text-[#E5C778]">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-[#133E2B]">
            The Source Scripture: Shrimad Bhagavad Gita
          </h2>
        </div>

        <div className="prose prose-stone text-base sm:text-lg text-[#323E37] leading-relaxed font-serif-title space-y-4">
          <p>
            The Bhagavad Gita is an integral portion of the ancient Sanskrit epic <em>Mahabharata</em>, situated in the <strong>Bhishma Parva</strong> (Chapters 23 through 40). It consists of exactly <strong>18 chapters</strong> comprising <strong>700 classical verses</strong> (often counted as 701 with introductory speaker verses like 1.1).
          </p>
          <p>
            The text is preserved in the classical Anushtup meter, with select verses in the Trishtup meter. The Sanskrit text in our database is transcribed in standard Devanagari script, alongside international Roman phonetic transliteration (IAST).
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-center">
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/20">
            <span className="font-display text-2xl font-bold text-[#133E2B] block">18</span>
            <span className="text-xs text-[#8C6D2D]">Complete Chapters</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/20">
            <span className="font-display text-2xl font-bold text-[#133E2B] block">701</span>
            <span className="text-xs text-[#8C6D2D]">Verified Verses</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/20">
            <span className="font-display text-2xl font-bold text-[#133E2B] block">4,900+</span>
            <span className="text-xs text-[#8C6D2D]">Scholarly Translations</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/20">
            <span className="font-display text-2xl font-bold text-[#133E2B] block">100%</span>
            <span className="text-xs text-[#8C6D2D]">Authentic & Grounded</span>
          </div>
        </div>
      </div>

      {/* Distinction Between Scripture, Translation & AI Reflection */}
      <div className="parchment-card p-6 sm:p-10 space-y-4 border-[#C5A059]/40 bg-[#FAF6EE]">
        <h2 className="font-serif-title text-2xl font-bold text-[#133E2B]">
          Three-Tier Epistemic Distinction
        </h2>
        <p className="text-sm sm:text-base text-[#46544D] font-serif-title leading-relaxed">
          We maintain an uncompromising distinction between the immutable Sanskrit scripture, human scholarly translations, and modern AI synthesis:
        </p>

        <div className="space-y-3 pt-2 text-sm text-[#38463F] font-serif-title">
          <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#C5A059]/20 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#133E2B] text-[#FAF8F5] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-[#133E2B] block">Tier 1: Original Sanskrit Scripture (Shruti / Smriti)</strong>
              <span>The original Devanagari shloka, meter, and chapter/verse coordinates are immutable historical texts, never modified or generated by AI.</span>
            </div>
          </div>

          <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#C5A059]/20 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#8C6D2D] text-[#FAF8F5] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-[#133E2B] block">Tier 2: Respected Scholarly Translations</strong>
              <span>English and Hindi translations are attributed directly to verified Sanskrit scholars and monastic translators (e.g. Swami Sivananda, Swami Gambhirananda, Swami Ramsukhdas).</span>
            </div>
          </div>

          <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#C5A059]/20 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#1E4E38] text-[#FAF8F5] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-[#133E2B] block">Tier 3: AI Reflection & Life Application</strong>
              <span>The explanation of how the verse connects to the user's personal problem and the practical next steps are synthesized by our AI counseling engine, strictly grounded in the retrieved verse.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scholarly Translators & Commentary Provenance */}
      <div className="space-y-6">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="font-display text-2xl font-bold text-[#133E2B]">
            Translators & Scholarly Lineage
          </h2>
          <p className="text-sm text-[#505D56] font-serif-title">
            The scriptural translations in our system derive from traditional, respected commentaries:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {translators.map((t, idx) => (
            <div key={idx} className="parchment-card p-5 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif-title text-base font-bold text-[#133E2B]">
                    {t.name}
                  </h3>
                  <span className="text-xs text-[#8C6D2D] font-medium block">
                    {t.institution}
                  </span>
                </div>
                <span className="text-[11px] bg-[#F2ECE0] text-[#133E2B] px-2 py-0.5 rounded font-semibold uppercase">
                  {t.language}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#55635C] leading-relaxed font-serif-title">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Source Data Citation */}
      <div className="parchment-card p-6 sm:p-8 space-y-4">
        <h2 className="font-serif-title text-xl font-bold text-[#133E2B]">
          Data Provenance & Open Source Attribution
        </h2>
        <p className="text-sm text-[#46544D] font-serif-title leading-relaxed">
          The machine-readable structured JSON dataset used for local verification and grounding is adapted from verified open-source digital projects maintained by the global Sanskrit open-data community:
        </p>
        <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <strong className="text-[#133E2B] block">Bhagavad Gita JSON Data Repository</strong>
            <span className="text-[#65736C]">Public domain & open research repository of all 701 verses and commentaries.</span>
          </div>
          <a
            href="https://github.com/praneshp1org/Bhagavad-Gita-JSON-data"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#133E2B] text-[#FAF8F5] font-semibold hover:bg-[#0B2418] transition-colors self-start sm:self-auto shrink-0"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
