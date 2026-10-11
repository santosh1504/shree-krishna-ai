import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Feather, Send, BookOpen, Shield, Heart, 
  RefreshCw, CheckCircle2, ArrowRight, Compass, MessageSquare 
} from 'lucide-react';
import { DilemmaGrid } from '../components/DilemmaGrid';
import { VerseCard } from '../components/VerseCard';
import { GuidanceCard } from '../components/GuidanceCard';
import { getVerseOfTheDay, askGuidance } from '../services/api';
import { Verse, GuidanceResponse } from '../types';

export const Home: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guidanceResult, setGuidanceResult] = useState<GuidanceResponse | null>(null);
  const [verseOfTheDay, setVerseOfTheDay] = useState<Verse | null>(null);
  const [loadingVerse, setLoadingVerse] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getVerseOfTheDay()
      .then(setVerseOfTheDay)
      .catch((err) => console.error('Failed to load verse of the day:', err))
      .finally(() => setLoadingVerse(false));
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!problem.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await askGuidance(problem.trim());
      setGuidanceResult(result);
      // Smooth scroll to guidance result
      setTimeout(() => {
        document.getElementById('guidance-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to spiritual guidance service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setProblem(prompt);
    // Focus composer
    const textarea = document.getElementById('home-composer');
    if (textarea) {
      textarea.focus();
      textarea.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFollowUp = (followUpText: string) => {
    // Navigate to full guidance chamber with context
    navigate(`/guidance?prompt=${encodeURIComponent(followUpText)}`);
  };

  const quickPills = [
    { label: "Anxious & Overthinking", query: "I cannot stop overthinking about what could go wrong with my future." },
    { label: "Career & Failure", query: "I worked very hard but failed at my goal. I feel defeated and lost." },
    { label: "Heartbreak & Letting Go", query: "Someone I cared for broke my trust. How do I let go of attachment?" },
    { label: "Family Expectations", query: "I feel guilty because my family's expectations clash with my own integrity." },
    { label: "Grief & Loss", query: "I am mourning a profound loss and feel hollow inside." },
    { label: "Difficult Decision", query: "I am standing at a life crossroads and don't know what the right moral choice is." }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 pb-4 text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F0E4] border border-[#C5A059]/35 text-[#8C6D2D] text-xs font-semibold tracking-wider uppercase">
          <Feather className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Compassionate Spiritual Guidance</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#133E2B] tracking-tight leading-[1.15]">
          Bring Your Burdens to the <span className="text-[#8C6D2D] italic font-serif-title font-normal">Bhagavad Gita</span>
        </h1>

        <p className="text-base sm:text-xl text-[#4A5750] font-serif-title max-w-2xl mx-auto leading-relaxed">
          When Arjun collapsed with sorrow on the battlefield of Kurukshetra, Shree Krishna met him not with judgment, but with timeless wisdom. Describe whatever is troubling you today.
        </p>

        {/* Working Message Composer Box */}
        <div id="home-composer-container" className="parchment-card p-4 sm:p-6 text-left max-w-3xl mx-auto shadow-md border-[#C5A059]/40 mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label htmlFor="home-composer" className="sr-only">
                Describe what is troubling you
              </label>
              <textarea
                id="home-composer"
                rows={4}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="What is weighing on your mind today? Share your thoughts freely — relationship struggles, career anxiety, grief, fear, or a difficult life decision..."
                className="w-full p-4 rounded-xl bg-[#FAF8F5] border border-[#C5A059]/30 text-[#1F2622] placeholder-[#8E9B93] text-base leading-relaxed focus:bg-[#FFFFFF] focus:border-[#C5A059] focus:outline-none transition-all resize-none font-serif-title"
                maxLength={3000}
                disabled={loading}
              />
              <div className="text-[11px] text-[#8C6D2D] text-right pt-1 font-medium">
                {problem.length} / 3000 characters
              </div>
            </div>

            {/* Quick Prompt Pills */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C6D2D] block">
                Common Reflections:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPills.map((pill, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setProblem(pill.query)}
                    className="text-xs bg-[#FBF9F4] hover:bg-[#F3EFE6] text-[#3B4842] hover:text-[#133E2B] px-3 py-1.5 rounded-full border border-[#C5A059]/25 hover:border-[#C5A059]/50 transition-all focus:outline-none"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-[#FFF5F2] border border-[#E07A5F]/40 rounded-xl text-sm text-[#A0351B] flex items-start gap-2.5">
                <span className="text-base">⚠️</span>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#C5A059]/15">
              <div className="flex items-center gap-2 text-xs text-[#707D76]">
                <Shield className="w-4 h-4 text-[#1E4E38]" />
                <span>Private & Ephemeral • Zero accounts required</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading || !problem.trim()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#133E2B] hover:bg-[#0B2418] text-[#FAF8F5] text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-[#C5A059]/30"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#E5C778]" />
                      <span>Retrieving Gita Wisdom...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#E5C778]" />
                      <span>Seek Spiritual Guidance</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Render Guidance Result right here if available */}
      {guidanceResult && (
        <section id="guidance-result" className="max-w-4xl mx-auto px-4 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#133E2B]">
              Spiritual Counsel for Your Heart
            </h2>
            <button
              onClick={() => {
                setGuidanceResult(null);
                setProblem('');
              }}
              className="text-xs text-[#8C6D2D] hover:text-[#133E2B] underline"
            >
              Ask Another Question
            </button>
          </div>
          <GuidanceCard 
            guidance={guidanceResult} 
            userPrompt={problem}
            onSelectFollowUp={handleFollowUp}
          />
        </section>
      )}

      {/* Featured Verse of the Day */}
      <section className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#8C6D2D]" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#133E2B]">
              Daily Bhagavad Gita Contemplation
            </h2>
          </div>
          <button
            onClick={() => navigate('/verses')}
            className="text-xs font-semibold text-[#8C6D2D] hover:text-[#133E2B] inline-flex items-center gap-1"
          >
            <span>Browse All 701 Verses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingVerse ? (
          <div className="parchment-card p-8 text-center text-sm text-[#707D76] animate-pulse">
            Loading today's contemplation...
          </div>
        ) : verseOfTheDay ? (
          <VerseCard verse={verseOfTheDay} featured={true} />
        ) : null}
      </section>

      {/* Life Dilemma Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <DilemmaGrid onSelectPrompt={handleSelectPrompt} />
      </section>

      {/* How It Works - The 3 Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="parchment-card p-8 sm:p-12 space-y-8 bg-gradient-to-br from-[#FFFFFF] via-[#FAF8F5] to-[#F7F2E7]">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-[#8C6D2D]">
              Our Guiding Architecture
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#133E2B]">
              How Shree Krishna AI Works
            </h2>
            <p className="text-sm text-[#505D56] font-serif-title">
              Designed with scriptural rigor, deep empathy, and complete privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#133E2B] text-[#E5C778] flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-lg font-bold text-[#133E2B]">
                1. Authentic Scripture Grounding
              </h3>
              <p className="text-xs sm:text-sm text-[#56635C] leading-relaxed">
                We never hallucinate Sanskrit or invent quotes. Every response is verified against our complete 701-verse Bhagavad Gita corpus with scholar translations.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#8C6D2D] text-[#FAF8F5] flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-lg font-bold text-[#133E2B]">
                2. Natural Everyday Compassion
              </h3>
              <p className="text-xs sm:text-sm text-[#56635C] leading-relaxed">
                Krishna taught Arjuna as an intimate companion in distress. We avoid dry scholasticism and communicate in warm, understandable everyday language.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#1E4E38] text-[#FAF8F5] flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-lg font-bold text-[#133E2B]">
                3. Concrete Practical Guidance
              </h3>
              <p className="text-xs sm:text-sm text-[#56635C] leading-relaxed">
                Philosophy is meaningless without application. Each reflection provides three practical steps for today and outlines mental traps to avoid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Pledge Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-6 rounded-2xl bg-[#F6F0E4]/70 border border-[#C5A059]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#133E2B] flex items-center justify-center text-[#E5C778] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#133E2B]">Your reflections remain yours</h3>
              <p className="text-xs text-[#505D56]">
                No account required. No sensitive conversations stored in our database.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/privacy')}
            className="text-xs font-semibold text-[#8C6D2D] hover:text-[#133E2B] underline whitespace-nowrap focus:outline-none"
          >
            Read Our Privacy Statement
          </button>
        </div>
      </section>
    </div>
  );
};
