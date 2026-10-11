import React from 'react';
import { Shield, Lock, EyeOff, Server, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F0E4] border border-[#C5A059]/35 text-[#8C6D2D] text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Honest Data Principles</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#133E2B]">
          Privacy & Data Handling Policy
        </h1>
        <p className="text-base sm:text-xl text-[#4D5C54] font-serif-title max-w-2xl mx-auto leading-relaxed">
          Clear, straightforward disclosures about what happens to your reflections, where requests are processed, and how you retain full control.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="parchment-card p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#133E2B] text-[#E5C778] flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-serif-title text-base font-bold text-[#133E2B]">No Sign-Up or Accounts</h3>
          <p className="text-xs text-[#526059] leading-relaxed">
            You do not need to provide an email, phone number, name, or password to seek guidance.
          </p>
        </div>

        <div className="parchment-card p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#8C6D2D] text-[#FAF8F5] flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-serif-title text-base font-bold text-[#133E2B]">Zero Conversation Databases</h3>
          <p className="text-xs text-[#526059] leading-relaxed">
            We do not store your private confessions or queries in any persistent user database.
          </p>
        </div>

        <div className="parchment-card p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#1E4E38] text-[#FAF8F5] flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="font-serif-title text-base font-bold text-[#133E2B]">Instant Local Erasure</h3>
          <p className="text-xs text-[#526059] leading-relaxed">
            Conversations live purely in your browser's temporary session and vanish when you click Clear or close the tab.
          </p>
        </div>
      </div>

      {/* Detailed Disclosures */}
      <div className="parchment-card p-6 sm:p-10 space-y-8">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-serif-title text-xl font-bold text-[#133E2B] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#8C6D2D]" />
            <span>1. What Information Is Collected and Processed</span>
          </h2>
          <div className="text-sm sm:text-base text-[#38463F] font-serif-title leading-relaxed space-y-2">
            <p>
              When you submit a question or dilemma, your submitted text is received by our server endpoint (<code>/api/guidance</code>) for the sole purpose of retrieving relevant Bhagavad Gita verses and synthesizing compassionate reflection.
            </p>
            <p>
              We do not track your IP address to your personal identity, and we do not request or collect personal demographic data.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-t border-[#C5A059]/20 pt-6">
          <h2 className="font-serif-title text-xl font-bold text-[#133E2B] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#8C6D2D]" />
            <span>2. Processing by External AI Providers</span>
          </h2>
          <div className="text-sm sm:text-base text-[#38463F] font-serif-title leading-relaxed space-y-2">
            <p>
              To provide thoughtful, context-aware responses, the server may forward your prompt and the retrieved scriptural verses to a configured cloud AI provider (specifically, Google's Gemini API via server-side secure credentials):
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#4E5C55]">
              <li>Your API calls are initiated exclusively from our server; no API secrets or client keys are ever exposed in your browser code.</li>
              <li>Google's developer API terms specify that data submitted via paid/standard developer API endpoints is not used to train foundation models without customer consent.</li>
              <li>If the server is operating in offline or local mode without an external API key, processing occurs entirely within the server's local scriptural engine with zero external network transmission.</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 border-t border-[#C5A059]/20 pt-6">
          <h2 className="font-serif-title text-xl font-bold text-[#133E2B] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#8C6D2D]" />
            <span>3. How Conversations Are Stored and Cleared</span>
          </h2>
          <div className="text-sm sm:text-base text-[#38463F] font-serif-title leading-relaxed space-y-2">
            <p>
              During your active session, your conversation messages are stored exclusively in <strong>volatile client-side application memory (React state)</strong>.
            </p>
            <p>
              We do not persist your chat history to <code>localStorage</code> or cookies by default, ensuring that anyone using the same shared or public computer will not accidentally discover your past questions once the page is closed or cleared.
            </p>
            <p>
              You can instantly wipe all conversation history at any moment by clicking the <strong>"Clear Conversation"</strong> button in the guidance chamber.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-t border-[#C5A059]/20 pt-6">
          <h2 className="font-serif-title text-xl font-bold text-[#133E2B] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#8C6D2D]" />
            <span>4. No Advertising Trackers or Session Replay</span>
          </h2>
          <div className="text-sm sm:text-base text-[#38463F] font-serif-title leading-relaxed space-y-2">
            <p>
              We believe a spiritual guidance website should be a sacred, quiet space, free from surveillance capitalism.
            </p>
            <p>
              This website contains <strong>zero third-party advertising trackers</strong>, zero session replay scripts (e.g. Hotjar, FullStory), zero cross-site retargeting pixels (e.g. Meta Pixel, TikTok Pixel), and zero data brokerage partners.
            </p>
          </div>
        </section>

        {/* Section 5: Honest Disclaimer */}
        <section className="bg-[#FAF6EE] p-5 sm:p-6 rounded-2xl border border-[#C5A059]/35 space-y-3">
          <h3 className="font-serif-title text-base font-bold text-[#8C6D2D] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#C5A059]" />
            <span>Important User Precaution: Do Not Share Sensitive Credentials</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#4E5C55] font-serif-title leading-relaxed">
            In keeping with ethical engineering best practices, we remind you: <em>no internet transmission is completely immune to external interception</em>. Please do not submit confidential financial details, passwords, government identification numbers, or real full names of third parties in your spiritual queries.
          </p>
        </section>
      </div>
    </div>
  );
};
