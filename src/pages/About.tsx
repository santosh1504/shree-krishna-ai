import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Heart, Shield, Sparkles, BookOpen, AlertCircle, Compass } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F0E4] border border-[#C5A059]/35 text-[#8C6D2D] text-xs font-semibold uppercase tracking-wider">
          <Feather className="w-3.5 h-3.5" />
          <span>Our Mission & Philosophy</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#133E2B]">
          About Shree Krishna AI
        </h1>
        <p className="text-base sm:text-xl text-[#4D5C54] font-serif-title max-w-2xl mx-auto leading-relaxed">
          Bringing the ancient, compassionate dialogue between seeker and teacher to anyone navigating life's complex moral and emotional crossroads.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="parchment-card p-6 sm:p-10 space-y-6">
        <h2 className="font-serif-title text-2xl font-bold text-[#133E2B]">
          The Universal Human Dilemma
        </h2>
        <div className="prose prose-stone text-base sm:text-lg text-[#323E37] leading-relaxed font-serif-title space-y-4">
          <p>
            Over five thousand years ago, on the dusty battlefield of Kurukshetra, the celebrated warrior Arjuna did not collapse because he lacked courage or weapons. He collapsed because his mind was torn apart by grief, moral confusion, and the agony of competing duties.
          </p>
          <p>
            He set down his bow, wept, and confessed to Krishna that his intellect was bewildered by sorrow. What followed in the 700 verses of the Bhagavad Gita was not a dogmatic set of commandments, but an intimate, psychological, and spiritual dialogue. Krishna met Arjuna's despair with unflinching empathy, timeless perspective, and actionable clarity.
          </p>
          <p>
            In our modern lives, we fight our own silent Kurukshetras every single day: the anxiety of career pressure, the heartbreak of broken relationships, the heavy burden of family expectations, the fear of mortality, and the haunting question of what is truly right.
          </p>
          <p>
            <strong>Shree Krishna AI</strong> was built to make that sacred conversation accessible to anyone in the world, free of charge, free of judgment, and free of unnecessary dogmatic barriers.
          </p>
        </div>
      </div>

      {/* Ethical Boundaries & What This AI Is Not */}
      <div className="parchment-card p-6 sm:p-10 space-y-6 border-[#8C6D2D]/35 bg-[#FAF6EE]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#133E2B] flex items-center justify-center text-[#E5C778]">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-[#133E2B]">
            Clear Ethical Boundaries & AI Limitations
          </h2>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-[#3A4740] font-serif-title leading-relaxed">
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#C5A059]/25 space-y-2">
            <h3 className="font-display text-sm uppercase tracking-wider text-[#8C6D2D] font-bold">
              1. Not a Literal Deity or Divine Channel
            </h3>
            <p>
              Shree Krishna AI is a software application grounded in the scriptural text of the Bhagavad Gita. It does not possess divine authority, omniscience, or supernatural consciousness. It must never be treated as an oracle or a living guru.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#C5A059]/25 space-y-2">
            <h3 className="font-display text-sm uppercase tracking-wider text-[#8C6D2D] font-bold">
              2. Not a Substitute for Clinical Healthcare
            </h3>
            <p>
              Spiritual reflections can offer deep solace and mental grounding, but they are not medical or psychiatric diagnoses. If you are experiencing clinical depression, severe anxiety disorders, or acute trauma, we strongly encourage consulting a qualified mental health clinician.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#C5A059]/25 space-y-2">
            <h3 className="font-display text-sm uppercase tracking-wider text-[#8C6D2D] font-bold">
              3. Crisis Resources
            </h3>
            <p>
              If you or someone you know is in immediate crisis, having suicidal thoughts, or in danger of self-harm, please do not rely on an AI website. Please connect immediately with human emergency services or dedicated helplines:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#133E2B]">
              <li><strong>United States & Canada:</strong> Call or text <strong>988</strong> (Suicide & Crisis Lifeline)</li>
              <li><strong>India:</strong> Call <strong>14416</strong> (Tele-MANAS) or <strong>9152987821</strong> (KIRAN)</li>
              <li><strong>United Kingdom:</strong> Call <strong>111</strong> (NHS Mental Health) or <strong>116 123</strong> (Samaritans)</li>
              <li><strong>International:</strong> Visit <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">findahelpline.com</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scriptural Integrity Pledge */}
      <div className="parchment-card p-6 sm:p-10 space-y-4">
        <h2 className="font-serif-title text-2xl font-bold text-[#133E2B]">
          Our Scriptural Integrity Standard
        </h2>
        <p className="text-sm sm:text-base text-[#46544D] font-serif-title leading-relaxed">
          Many generic AI bots fabricate quotes or blend unrelated traditions carelessly. We maintain strict fidelity to the scripture:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#C5A059]/20 space-y-1">
            <span className="font-bold text-sm text-[#133E2B] block">701 Authentic Verses</span>
            <p className="text-xs text-[#5C6A62]">
              All 18 chapters verified against standard critical editions with Devanagari text.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#C5A059]/20 space-y-1">
            <span className="font-bold text-sm text-[#133E2B] block">Scholarly Translations</span>
            <p className="text-xs text-[#5C6A62]">
              Rooted in esteemed commentaries by Swami Sivananda, Swami Gambhirananda, and traditional scholars.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#C5A059]/20 space-y-1">
            <span className="font-bold text-sm text-[#133E2B] block">Zero Hallucinations</span>
            <p className="text-xs text-[#5C6A62]">
              Every chapter and verse citation is validated before presenting guidance to you.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-4">
        <Link
          to="/guidance"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#133E2B] text-[#FAF8F5] font-semibold text-sm hover:bg-[#0B2418] shadow-md transition-all border border-[#C5A059]/40"
        >
          <Sparkles className="w-4 h-4 text-[#E5C778]" />
          <span>Begin Your Reflection</span>
        </Link>
      </div>
    </div>
  );
};
