import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Send, RefreshCw, Trash2, Sparkles, Feather, AlertCircle, 
  MessageSquare, Shield, HelpCircle 
} from 'lucide-react';
import { GuidanceCard } from '../components/GuidanceCard';
import { askGuidance } from '../services/api';
import { ChatMessage } from '../types';

export const Guidance: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle URL prompt param if passed from Home or Verses
  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt');
    if (promptFromUrl && promptFromUrl.trim()) {
      handleSendMessage(promptFromUrl.trim());
      // Clear URL parameter so refreshing doesn't resubmit
      setSearchParams({});
    }
  }, [searchParams]);

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    setErrorMessage(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Pass previous messages as context
      const previousTurns = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const guidance = await askGuidance(text, previousTurns);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: guidance.englishTranslation,
        guidance,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Guidance error:', err);
      setErrorMessage(err.message || 'Unable to connect to the spiritual guidance service. Please try again.');
      // Restore input text so the user doesn't lose their thought
      setInput(text);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    setInput('');
    setErrorMessage(null);
    setShowClearConfirm(false);
  };

  const quickPrompts = [
    "I am paralyzed by fear of making the wrong decision.",
    "How can I manage acute grief over losing someone?",
    "Why do my thoughts race and create worst-case scenarios?",
    "I feel deep resentment toward someone who wronged me."
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Chamber Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#C5A059]/25">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#133E2B] flex items-center justify-center text-[#E5C778] shadow-sm">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#133E2B]">
              Spiritual Guidance Chamber
            </h1>
            <p className="text-xs text-[#8C6D2D] font-medium">
              Confidential • Inspired by the Bhagavad Gita • 701 Verified Verses
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#8A4828] hover:bg-[#FBEBE5] border border-[#E07A5F]/30 transition-all focus:outline-none"
            aria-label="Clear active conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Conversation</span>
          </button>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="p-4 bg-[#FFF5F2] border border-[#E07A5F]/50 rounded-xl space-y-3 animate-fadeIn">
          <p className="text-sm font-semibold text-[#8A4828]">
            Are you sure you want to clear your conversation?
          </p>
          <p className="text-xs text-[#505D56]">
            All messages in this session will be permanently erased from your browser memory.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleClearConversation}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#A0351B] text-[#FAF8F5] hover:bg-[#832610] transition-colors"
            >
              Yes, Clear Memory
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#FFFFFF] border border-[#C5A059]/30 text-[#2C3530] hover:bg-[#F5EFE6] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Welcome State (If No Messages) */}
      {messages.length === 0 && (
        <div className="parchment-card p-6 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#F6F0E4] border border-[#C5A059]/40 flex items-center justify-center mx-auto text-[#133E2B]">
            <Sparkles className="w-8 h-8 text-[#8C6D2D]" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#133E2B]">
              Share What Is on Your Heart
            </h2>
            <p className="text-sm sm:text-base text-[#526059] font-serif-title leading-relaxed">
              Speak as you would to a trusted friend. Whether you are grappling with overwhelming anxiety, a career crossroads, relationship heartbreak, or moral dilemma, ancient wisdom holds a mirror to your strength.
            </p>
          </div>

          <div className="space-y-3 pt-2 max-w-md mx-auto">
            <span className="text-xs uppercase tracking-wider font-bold text-[#8C6D2D] block">
              Or Choose a Question to Begin:
            </span>
            <div className="space-y-2">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left text-xs sm:text-sm bg-[#FAF8F5] hover:bg-[#F2ECE0] text-[#2F3A34] p-3 rounded-xl border border-[#C5A059]/25 hover:border-[#C5A059]/60 transition-all focus:outline-none"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#C5A059]/20 flex items-center justify-center gap-4 text-xs text-[#707D76]">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#1E4E38]" /> No login required
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-[#8C6D2D]" /> Scripture Grounded
            </span>
          </div>
        </div>
      )}

      {/* Messages Stream */}
      <div className="space-y-8">
        {messages.map((message) => {
          if (message.role === 'user') {
            return (
              <div key={message.id} className="flex justify-end animate-fadeIn">
                <div className="max-w-2xl bg-[#133E2B] text-[#FAF8F5] p-4 sm:p-5 rounded-2xl rounded-tr-xs shadow-sm space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#E5C778] block">
                    You Shared:
                  </span>
                  <p className="font-serif-title text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            );
          }

          if (message.role === 'assistant' && message.guidance) {
            return (
              <div key={message.id} className="space-y-2">
                <GuidanceCard 
                  guidance={message.guidance} 
                  onSelectFollowUp={(suggestion) => handleSendMessage(suggestion)}
                />
              </div>
            );
          }

          return null;
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="parchment-card p-6 text-center space-y-3 animate-pulse border-[#C5A059]/40">
            <RefreshCw className="w-6 h-6 animate-spin text-[#8C6D2D] mx-auto" />
            <p className="font-serif-title text-base text-[#133E2B] font-semibold">
              Searching the Bhagavad Gita & synthesizing compassionate guidance...
            </p>
            <p className="text-xs text-[#707D76]">
              Verifying authentic Sanskrit verse and formulating practical reflections
            </p>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 bg-[#FFF5F2] border border-[#E07A5F] rounded-xl text-sm text-[#A0351B] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#A0351B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block">Notice on Guidance Generation:</strong>
              <p className="text-xs leading-relaxed">{errorMessage}</p>
              <button
                type="button"
                onClick={() => handleSendMessage(input || 'Please give me spiritual guidance for my dilemma.')}
                className="mt-2 px-3 py-1 bg-[#A0351B] text-[#FAF8F5] rounded-lg text-xs font-semibold hover:bg-[#832610] transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Multiline Message Composer */}
      <div className="sticky bottom-4 z-30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="parchment-card p-3 sm:p-4 shadow-xl border-[#C5A059]/50 bg-[#FFFFFF]/95 backdrop-blur-md space-y-2"
        >
          <div className="relative flex items-end gap-2">
            <textarea
              ref={textareaRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your situation or ask a follow-up question... (Press Enter to send, Shift+Enter for new line)"
              className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#C5A059]/30 text-[#1F2622] placeholder-[#8C9890] text-sm sm:text-base leading-relaxed focus:bg-[#FFFFFF] focus:border-[#C5A059] focus:outline-none transition-all resize-none font-serif-title"
              maxLength={3000}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 rounded-xl bg-[#133E2B] hover:bg-[#0B2418] text-[#FAF8F5] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0 border border-[#C5A059]/30 focus:outline-none"
              aria-label="Send message"
            >
              <Send className="w-5 h-5 text-[#E5C778]" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#707D76] px-1">
            <span>Press <kbd className="px-1.5 py-0.5 bg-[#FAF8F5] rounded border border-[#C5A059]/30 text-[#2C3530]">Enter</kbd> to send</span>
            <span>{input.length} / 3000 chars</span>
          </div>
        </form>
      </div>
    </div>
  );
};
