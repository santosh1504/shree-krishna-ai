import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen, Filter, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { VerseCard } from '../components/VerseCard';
import { searchVerses, getChapters } from '../services/api';
import { Verse, Chapter } from '../types';

export const Verses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');

  const themes = [
    { id: '', label: 'All Themes' },
    { id: 'action_and_duty', label: 'Action & Duty (Karma)' },
    { id: 'mind_and_meditation', label: 'Mind & Meditation' },
    { id: 'fear_and_mortality', label: 'Fear, Death & Soul' },
    { id: 'peace_and_equanimity', label: 'Peace & Equanimity' },
    { id: 'relationships_and_compassion', label: 'Relationships & Love' },
    { id: 'dilemma_and_dharma', label: 'Dharma & Dilemmas' },
    { id: 'anger_and_desire', label: 'Anger & Desire' }
  ];

  // Load chapters once
  useEffect(() => {
    getChapters()
      .then(setChapters)
      .catch((err) => console.error('Failed to load chapters:', err));
  }, []);

  // Check URL query parameters (e.g. ?ref=2.47)
  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) {
      setSearchQuery(refParam);
    }
  }, [searchParams]);

  // Execute search when filters or query change
  useEffect(() => {
    setLoading(true);
    searchVerses({
      q: searchQuery,
      chapter: selectedChapter !== '' ? selectedChapter : undefined,
      theme: selectedTheme || undefined,
      limit: 40
    })
      .then(setVerses)
      .catch((err) => console.error('Failed to search verses:', err))
      .finally(() => setLoading(false));
  }, [searchQuery, selectedChapter, selectedTheme]);

  const activeChapterInfo = chapters.find(c => c.chapter_number === Number(selectedChapter));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-bold text-[#8C6D2D]">
          Scriptural Archive
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#133E2B]">
          Bhagavad Gita Explorer
        </h1>
        <p className="text-base text-[#526059] font-serif-title leading-relaxed">
          Search, read, and contemplate all 18 chapters and 701 verified verses with authentic Sanskrit Devanagari, transliteration, and scholarly English translations.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="parchment-card p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword Search */}
          <div className="md:col-span-2 relative">
            <label htmlFor="search-verses" className="sr-only">Search verses</label>
            <Search className="w-5 h-5 text-[#8C6D2D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-verses"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. duty, anger, meditation) or verse reference (e.g. 2.47)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#C5A059]/30 text-sm text-[#1F2622] placeholder-[#8A978E] focus:bg-[#FFFFFF] focus:border-[#C5A059] focus:outline-none transition-all font-serif-title"
            />
          </div>

          {/* Chapter Selector Dropdown */}
          <div>
            <label htmlFor="chapter-select" className="sr-only">Select Chapter</label>
            <select
              id="chapter-select"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value ? Number(e.target.value) : '')}
              className="w-full py-3 px-3.5 rounded-xl bg-[#FAF8F5] border border-[#C5A059]/30 text-sm text-[#1F2622] focus:bg-[#FFFFFF] focus:border-[#C5A059] focus:outline-none transition-all"
            >
              <option value="">All 18 Chapters</option>
              {chapters.map((ch) => (
                <option key={ch.chapter_number} value={ch.chapter_number}>
                  Chapter {ch.chapter_number}: {ch.name_translation} ({ch.verses_count} verses)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Theme Pills */}
        <div className="space-y-1.5 pt-2 border-t border-[#C5A059]/15">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C6D2D] block">
            Filter by Theme:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {themes.map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setSelectedTheme(th.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  selectedTheme === th.id
                    ? 'bg-[#133E2B] text-[#FAF8F5] border-[#133E2B]'
                    : 'bg-[#FBF9F4] text-[#4A5750] border-[#C5A059]/25 hover:border-[#C5A059]'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chapter Overview Card (if chapter selected) */}
      {activeChapterInfo && (
        <div className="parchment-card p-6 sm:p-8 space-y-3 bg-[#FAF6EE] border-[#C5A059]/40">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C5A059]/20 pb-3">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-[#8C6D2D]">
                Chapter {activeChapterInfo.chapter_number}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#133E2B]">
                {activeChapterInfo.name_sanskrit} ({activeChapterInfo.name_transliterated})
              </h2>
              <span className="text-xs sm:text-sm text-[#8C6D2D] font-serif-title italic">
                {activeChapterInfo.name_meaning} • {activeChapterInfo.verses_count} Verses
              </span>
            </div>
          </div>
          <p className="text-sm sm:text-base text-[#3E4C44] leading-relaxed font-serif-title whitespace-pre-line">
            {activeChapterInfo.summary}
          </p>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-[#5C6A62]">
        <span>
          Showing <strong className="text-[#133E2B]">{verses.length}</strong> verses
          {selectedChapter && ` from Chapter ${selectedChapter}`}
          {selectedTheme && ` under theme "${themes.find(t => t.id === selectedTheme)?.label}"`}
        </span>
      </div>

      {/* Verses Stream */}
      {loading ? (
        <div className="parchment-card p-12 text-center text-[#707D76] space-y-3 animate-pulse">
          <RefreshCw className="w-6 h-6 animate-spin text-[#8C6D2D] mx-auto" />
          <p className="font-serif-title text-base">Retrieving verified Bhagavad Gita verses...</p>
        </div>
      ) : verses.length === 0 ? (
        <div className="parchment-card p-12 text-center text-[#5C6A62] space-y-3">
          <p className="font-serif-title text-lg font-semibold text-[#133E2B]">
            No verses matched your search query.
          </p>
          <p className="text-sm">
            Try searching for terms like "karma", "duty", "mind", "death", or reset your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedChapter('');
              setSelectedTheme('');
            }}
            className="mt-2 px-4 py-2 bg-[#133E2B] text-[#FAF8F5] text-xs font-semibold rounded-full"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {verses.map((verse) => (
            <VerseCard key={verse.reference} verse={verse} />
          ))}
        </div>
      )}
    </div>
  );
};
