import React from 'react';
import { 
  Brain, Briefcase, HeartHandshake, Users, Flame, 
  Compass, Sparkles, Feather, ArrowRight 
} from 'lucide-react';
import curatedTopicsData from '../data/curated_topics.json';
import { CuratedTopic } from '../types';

interface DilemmaGridProps {
  onSelectPrompt: (prompt: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Brain,
  Briefcase,
  HeartHandshake,
  Users,
  Flame,
  Compass,
  Sparkles,
  Feather
};

export const DilemmaGrid: React.FC<DilemmaGridProps> = ({ onSelectPrompt }) => {
  const topics: CuratedTopic[] = curatedTopicsData as CuratedTopic[];

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-bold text-[#8C6D2D]">
          Areas of Guidance
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#133E2B]">
          What Weighs Upon Your Heart Today?
        </h2>
        <p className="text-sm sm:text-base text-[#56635C] font-serif-title">
          Explore how ancient wisdom speaks directly to everyday challenges. Select a topic or question to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {topics.map((topic) => {
          const IconComponent = iconMap[topic.icon] || Compass;

          return (
            <div 
              key={topic.id}
              className="parchment-card p-5 sm:p-6 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#F6F0E4] border border-[#C5A059]/30 flex items-center justify-center text-[#133E2B] group-hover:scale-105 transition-transform">
                    <IconComponent className="w-5 h-5 text-[#8C6D2D]" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#8C6D2D] bg-[#FAF6EE] px-2.5 py-1 rounded-full border border-[#C5A059]/20">
                    BG {topic.primaryVerse}
                  </span>
                </div>

                <h3 className="font-serif-title text-lg font-bold text-[#133E2B] group-hover:text-[#0B2418] transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#505D56] leading-relaxed">
                  {topic.description}
                </p>
              </div>

              {/* Sample Prompts */}
              <div className="space-y-2 pt-2 border-t border-[#C5A059]/15">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C6D2D] block">
                  Suggested Questions:
                </span>
                <div className="space-y-1.5">
                  {topic.samplePrompts.slice(0, 2).map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => onSelectPrompt(prompt)}
                      className="w-full text-left text-xs bg-[#FAF8F5] hover:bg-[#F3ECE0] text-[#2C3530] p-2.5 rounded-lg border border-[#C5A059]/20 hover:border-[#C5A059]/50 transition-all flex items-center justify-between group/btn focus:outline-none"
                    >
                      <span className="line-clamp-2 pr-2">{prompt}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8C6D2D] opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
