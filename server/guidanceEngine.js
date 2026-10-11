import { retrieveVersesForProblem, getVerseByRef } from './retrieval.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

export function isGeminiConfigured() {
  return Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 5);
}

/**
 * Generate compassionate spiritual guidance grounded strictly in verified Bhagavad Gita scripture.
 */
export async function generateSpiritualGuidance({ problem, conversationHistory = [] }) {
  if (!problem || !problem.trim()) {
    throw new Error('Please describe your concern or situation.');
  }

  // 1. Retrieve authentic verses matching the user's situation
  const { primary, secondary, topic } = retrieveVersesForProblem(problem);

  if (!primary) {
    throw new Error('Unable to retrieve relevant scriptural verses.');
  }

  // 2. Try generative AI via Gemini if configured
  if (isGeminiConfigured()) {
    try {
      const geminiResult = await callGeminiWithGrounding({
        problem,
        primaryVerse: primary,
        secondaryVerses: secondary,
        topic,
        conversationHistory
      });

      if (geminiResult) {
        return {
          ...geminiResult,
          mode: 'gemini',
          providerDisclosed: 'Gemini 2.5 Flash with Verified Gita Scripture Grounding',
          verifiedVerse: primary,
          supportingVerses: secondary
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, falling back to local scripture synthesis:', err.message);
      // Fall through to authentic local scripture synthesis
    }
  }

  // 3. Authentic Scripture-Grounded Local Synthesis Engine
  const localResult = synthesizeLocalGroundedGuidance({
    problem,
    primaryVerse: primary,
    secondaryVerses: secondary,
    topic,
    conversationHistory
  });

  return {
    ...localResult,
    mode: 'scripture_grounded_local',
    providerDisclosed: isGeminiConfigured() 
      ? 'Scripture-Grounded Synthesis (Gemini fallback active)' 
      : 'Authentic Scripture-Grounded Synthesis Engine (Add GEMINI_API_KEY for dynamic generative synthesis)',
    verifiedVerse: primary,
    supportingVerses: secondary
  };
}

/**
 * Calls Gemini API with strict system instructions and verified grounding data.
 */
async function callGeminiWithGrounding({ problem, primaryVerse, secondaryVerses, topic, conversationHistory }) {
  const prompt = `
You are Shree Krishna AI, a compassionate spiritual counselor inspired by the sacred teachings of the Bhagavad Gita.
You provide empathetic, wise, and grounded spiritual guidance to help people navigate life's challenges.

CRITICAL ETHICAL RULES:
1. You are an AI inspired by the wisdom of the Bhagavad Gita. You MUST NEVER claim to literally be Lord Krishna, nor claim divine powers or supernatural authority.
2. You MUST strictly ground your guidance in the verified Bhagavad Gita verse provided below. Do NOT invent verses, change chapter/verse numbers, or quote nonexistent scriptures.
3. Respond in everyday, accessible, compassionate English. Avoid dry academic or archaic jargon.
4. Always structure your response into the exact 11 sections specified below.

VERIFIED SCRIPTURE GROUNDING PROVIDED TO YOU:
- Primary Verse Reference: Chapter ${primaryVerse.chapter}, Verse ${primaryVerse.verse}
- Sanskrit Shloka: ${primaryVerse.slok}
- Transliteration: ${primaryVerse.transliteration}
- Word Meanings: ${primaryVerse.word_meanings}
- Authoritative English Translation: "${primaryVerse.translation_english}" (Translation by ${primaryVerse.translator_english})
${secondaryVerses && secondaryVerses.length > 0 ? `
Supporting Verses:
${secondaryVerses.map(v => `- Chapter ${v.chapter}, Verse ${v.verse}: "${v.translation_english}"`).join('\n')}
` : ''}

USER'S CONCERN:
"${problem}"

RESPOND ONLY IN VALID JSON FORMAT matching this schema:
{
  "acknowledgment": "A warm, deeply empathetic validation of the user's feelings and situation in 2-3 sentences.",
  "sanskritShloka": "${primaryVerse.slok.replace(/"/g, '\\"')}",
  "chapterVerse": "Chapter ${primaryVerse.chapter}, Verse ${primaryVerse.verse}",
  "transliteration": "${primaryVerse.transliteration.replace(/"/g, '\\"')}",
  "englishTranslation": "${primaryVerse.translation_english.replace(/"/g, '\\"')}",
  "everydayExplanation": "Clear, gentle breakdown of the verse's meaning in natural, everyday language (2-3 paragraphs).",
  "connectionToProblem": "Direct, compassionate explanation of exactly why this teaching applies to the user's specific worry or dilemma.",
  "practicalActions": [
    "Specific actionable step 1 they can do right now or today",
    "Specific actionable step 2 for changing their mental focus",
    "Specific actionable step 3 for ongoing practice"
  ],
  "thingsToAvoid": [
    "A trap or counter-productive behavior to avoid, and why it harms inner peace",
    "A second mindset or habit to avoid and why"
  ],
  "concludingThought": "A gentle, uplifting final blessing and reminder that they are not alone and have the strength within.",
  "sources": {
    "scripture": "Shrimad Bhagavad Gita",
    "chapter": "Chapter ${primaryVerse.chapter}",
    "verse": "Verse ${primaryVerse.verse}",
    "translator": "${primaryVerse.translator_english}",
    "historicalNote": "Sanskrit text preserved from the critical recension of the Mahabharata, Bhishma Parva."
  },
  "followUpSuggestions": [
    "A thoughtful question the user might ask next to explore this deeper",
    "A second contextual follow-up question",
    "A third contextual follow-up question"
  ]
}
`;

  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 18000); // 18s timeout

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    }),
    signal: controller.signal
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API responded with status ${response.status}: ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();
  const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidateText) {
    throw new Error('Gemini response was empty or missing candidates.');
  }

  // Parse JSON
  const cleanedText = candidateText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
  const parsed = JSON.parse(cleanedText);

  // Validate that chapterVerse and sanskrit match our verified verse
  parsed.sanskritShloka = primaryVerse.slok;
  parsed.chapterVerse = `Chapter ${primaryVerse.chapter}, Verse ${primaryVerse.verse}`;
  parsed.transliteration = primaryVerse.transliteration;
  parsed.englishTranslation = primaryVerse.translation_english;
  parsed.sources = {
    scripture: 'Shrimad Bhagavad Gita',
    chapter: `Chapter ${primaryVerse.chapter}`,
    verse: `Verse ${primaryVerse.verse}`,
    translator: primaryVerse.translator_english,
    historicalNote: 'Verified against authentic Sanskrit critical edition with commentary tradition.'
  };

  return parsed;
}

/**
 * Intelligent Scripture-Grounded Synthesis Engine.
 * Formats the exact 11-step guidance using the retrieved verified verse and curated spiritual wisdom.
 */
function synthesizeLocalGroundedGuidance({ problem, primaryVerse, secondaryVerses, topic, conversationHistory }) {
  const ref = `${primaryVerse.chapter}.${primaryVerse.verse}`;

  // Compassionate acknowledgment tailored to user's tone and problem
  const acknowledgment = generateWarmAcknowledgment(problem, topic);

  // Practical actions and avoidances based on the verse's teaching and problem topic
  const { explanation, connection, actions, avoidances, concludingThought, followUps } = getDetailedScripturalGuidance(problem, primaryVerse, topic);

  return {
    acknowledgment,
    sanskritShloka: primaryVerse.slok,
    chapterVerse: `Chapter ${primaryVerse.chapter}, Verse ${primaryVerse.verse}`,
    transliteration: primaryVerse.transliteration,
    englishTranslation: primaryVerse.translation_english,
    everydayExplanation: explanation,
    connectionToProblem: connection,
    practicalActions: actions,
    thingsToAvoid: avoidances,
    concludingThought,
    sources: {
      scripture: 'Shrimad Bhagavad Gita',
      chapter: `Chapter ${primaryVerse.chapter} (${topic?.title || 'Yoga'})`,
      verse: `Verse ${primaryVerse.verse}`,
      translator: primaryVerse.translator_english || 'Swami Sivananda',
      historicalNote: 'Original Sanskrit verse preserved in the Mahabharata (Bhishma Parva), cross-referenced with traditional commentaries.'
    },
    followUpSuggestions: followUps
  };
}

function generateWarmAcknowledgment(problem, topic) {
  const p = problem.toLowerCase();

  if (p.includes('grief') || p.includes('lost') || p.includes('death') || p.includes('passed away')) {
    return 'I hear the tender ache in your heart, and I want to acknowledge how heavy this grief feels right now. When we face loss, words can seem small, but the wisdom of the Gita offers a sanctuary of profound peace and remembrance for your soul.';
  }

  if (p.includes('overthinking') || p.includes('anxiety') || p.includes('racing') || p.includes('panic')) {
    return 'It takes courage to acknowledge when our thoughts have become overwhelming. Please take a gentle, deep breath right now. You are not weak for experiencing an anxious or racing mind; even Arjuna, the greatest warrior of his time, sat down trembling and overwhelmed on the battlefield.';
  }

  if (p.includes('fail') || p.includes('career') || p.includes('job') || p.includes('exam') || p.includes('worthless')) {
    return 'I hear how exhausted and burdened you feel by the weight of expectations and the pain of setback. Carrying the burden of wanting things to turn out right while feeling let down is one of the deepest struggles human beings endure, but your worth is never defined by a temporary outcome.';
  }

  if (p.includes('relationship') || p.includes('heartbreak') || p.includes('trust') || p.includes('breakup')) {
    return 'Experiencing heartache and broken expectations with someone you cared for can feel disorienting and deeply painful. Your feelings are completely valid, and it is natural to feel hurt when love meets friction or departure.';
  }

  if (p.includes('decision') || p.includes('crossroads') || p.includes('lost') || p.includes('what should i do')) {
    return 'Standing at a life crossroads without a clear map can make anyone feel lonely and uncertain. Recognize that your desire to do what is right (your Dharma) is already the beginning of wisdom, even if the path forward seems obscured today.';
  }

  return 'I receive your words with deep compassion and respect for what you are walking through. In the moments when life feels uncertain or heavy, the ancient dialogue of the Bhagavad Gita meets us not as rigid rules, but as an intimate friend walking beside us.';
}

function getDetailedScripturalGuidance(problem, verse, topic) {
  const ref = `${verse.chapter}.${verse.verse}`;

  // Custom rich spiritual commentary tailored by verse
  if (ref === '2.47') {
    return {
      explanation: `In this timeless verse, Shree Krishna addresses the root cause of almost all chronic human anxiety: our obsession with outcomes we cannot completely control.

Krishna explains that human life operates on two planes: the arena of effort (which belongs entirely to you), and the sphere of results (which is governed by countless external variables, timing, and universal law). When you pour your energy into doing your sincere best, your mind remains focused and powerful. But the moment you mentally jump ahead to demand a specific outcome, you invite fear, paralysis, and disappointment.

Importantly, Krishna warns against slipping into apathy or giving up ("let not your attachment be to inaction"). Renouncing attachment to the fruit does not mean doing shoddy work; it means working with immense dedication while releasing the gripping anxiety over whether the world will praise or reject you.`,
      connection: `In your situation with "${problem.slice(0, 60)}...", much of the suffering comes not merely from the difficulty of the task, but from the fear of an unfavorable outcome. By reclaiming your focus on today's sincere action and releasing the obsession over the final outcome, you immediately lift a massive boulder off your shoulders.`,
      actions: [
        'Identify the single next sincere action within your direct control today, and pour your heart into doing it well without looking ahead.',
        'Whenever you notice anxiety about future results creeping in, silently remind yourself: "My sacred duty is the effort; the fruit belongs to the Divine."',
        'Dedicate your work as an offering to a higher good rather than a test of your personal ego or validation.'
      ],
      avoidances: [
        'Avoid obsessively refreshing, calculating, or ruminating over future results that are outside your immediate control.',
        'Avoid falling into total despair or giving up on your responsibilities under the guise of detachment; apathy is not peace.'
      ],
      concludingThought: 'Focus on planting and watering the seeds with love and integrity; trust that life will bring the fruit in its rightful season. You are far more capable than your worries suggest.',
      followUps: [
        'How can I stay motivated to work hard if I am not attached to the reward?',
        'What should I do when others judge me strictly by my results?',
        'How can I practice this equanimity when facing an imminent deadline or exam?'
      ]
    };
  }

  if (ref === '6.35' || ref === '6.5' || ref === '6.26') {
    return {
      explanation: `When Arjuna honestly confided to Krishna that his mind felt as wild and untamable as the wind, Krishna did not scold him. Instead, Krishna compassionately agreed: "Yes, the mind is indeed restless and difficult to curb."

Krishna then offered two master keys for bringing peace to an agitated mind: Abhyasa (gentle, consistent practice) and Vairagya (healthy detachment and letting go).

Abhyasa means that whenever you notice your mind wandering off into worst-case scenarios, you do not beat yourself up. You simply notice it and patiently escort your attention back to the present moment, again and again, like teaching a young child. Vairagya means learning to observe anxious thoughts as passing mental clouds rather than absolute truths that you must obey or fight.`,
      connection: `Your struggle with overthinking is not a personal defect—it is simply the natural turbulence of the human mind when left unattended. By practicing gentle return (Abhyasa) rather than waging war against your own thoughts, you break the cycle of panic and restore clarity.`,
      actions: [
        'Set aside 5 to 10 minutes twice a day for stillness: sit quietly, watch your natural breathing, and practice observing thoughts without chasing them.',
        'When an intrusive worry appears, pause and label it gently: "This is just a thought, not a command or a guaranteed reality."',
        'Anchor yourself in your physical senses: feel your feet on the ground, wash your hands with cool water, or take three conscious slow exhales.'
      ],
      avoidances: [
        'Avoid fighting with your mind or feeling angry at yourself for having anxious thoughts; resisting thoughts only gives them more momentum.',
        'Avoid consuming constant rapid media, news, or arguments when your nervous system is already in overload.'
      ],
      concludingThought: 'You do not have to control all of your thoughts; you only need to stop letting them control you. Step by step, patience with yourself is the highest spiritual discipline.',
      followUps: [
        'How do I practice meditation when my thoughts won\'t stop buzzing?',
        'What does healthy detachment mean in everyday family and work life?',
        'How can I help my mind rest peacefully before going to sleep?'
      ]
    };
  }

  if (ref === '12.13' || ref === '12.14' || ref === '5.18') {
    return {
      explanation: `In the Twelfth Chapter, Krishna describes the qualities of a soul who is truly dear to the Divine. The foremost quality is Adveshta Sarva-bhutanam—holding malice toward none, and being Maitrah (friendly) and Karuna (compassionate) to all beings.

Krishna emphasizes that peaceful relationships are born from Nirmamo (freedom from possessiveness) and Nirahankara (freedom from rigid ego). When we believe we "own" another person, their choices, or their opinions of us, every disagreement feels like an existential threat. But when we view people as sovereign souls on their own distinct karmic journey, compassion naturally takes the place of bitter resentment.

He also advises remaining Sama-duhkha-sukha—balanced through the inevitable highs and lows of human interactions, forgiving others not because they were always right, but because your inner peace is too precious to compromise.`,
      connection: `Regarding your relationship concern, much of the pain often stems from unmet expectations or wanting the other person to be different than who they are capable of being right now. Shifting from possessiveness to genuine compassion protects your boundaries while purifying your heart.`,
      actions: [
        'Practice separating a person\'s hurtful actions from your fundamental sense of security; do not let another\'s turbulence destabilize your center.',
        'Set clear, respectful boundaries without anger, speaking your truth calmly rather than defensively.',
        'Send a silent prayer or wish of well-being even to those who have tested your patience, freeing yourself from the poison of resentment.'
      ],
      avoidances: [
        'Avoid replaying old grievances or trying to force someone to understand your perspective when they are unwilling to listen.',
        'Avoid measuring your self-worth by how warmly or coldly someone else treats you on any given day.'
      ],
      concludingThought: 'Love deeply, but hold lightly. True spiritual love gives space to breathe, honors dignity, and leaves your inner sanctuary intact.',
      followUps: [
        'How do I forgive someone who never apologized to me?',
        'What is the difference between healthy boundaries and emotional coldness?',
        'How can I stay compassionate when dealing with difficult family members?'
      ]
    };
  }

  if (ref === '2.20' || ref === '2.22' || ref === '2.27') {
    return {
      explanation: `At the heart of the Bhagavad Gita lies Krishna's revelation about the eternal nature of the soul. At the edge of battle, surrounded by the reality of mortality, Krishna comforts Arjuna by lifting his gaze to eternity: the physical body is like a garment that is worn, fulfills its purpose, and is eventually laid aside, but the Atman (the true Self) is unborn, imperishable, and eternal.

Death and change are the inescapable laws of the physical cosmos: "For that which is born, death is certain; and for that which is dead, birth is certain." (BG 2.27). Grieving is a natural human expression of love, but despair comes from forgetting that what was truly cherished—the consciousness, the love, the spirit—can never be destroyed by fire, water, or time.

When we understand this impermanence, every present moment with loved ones becomes sacred, and our fear of loss transforms into reverence for the eternal bond that connects all living beings.`,
      connection: `In the shadow of your grief or fear of loss, know that your pain is an echo of the love you carry. The Gita invites you to anchor yourself in the truth that the soul transcends the physical container, and that true love is an eternal connection that no physical departure can sever.`,
      actions: [
        'Allow yourself to feel and express your grief without shame; tears are the natural tribute of deep love.',
        'Honor the memory of departed loved ones or life chapters by living out the highest values and kindness they inspired in you.',
        'Spend quiet time in nature or contemplation, tuning into the silent, unchanging presence beneath the fleeting forms of this world.'
      ],
      avoidances: [
        'Avoid suppressing your sorrow or forcing yourself to put on a false mask of strength before you are ready.',
        'Avoid spiraling into existential nihilism; impermanence gives life its precious sweetness and calls us to love deeply today.'
      ],
      concludingThought: 'The love you shared was not created by the physical world, and the physical world cannot destroy it. May peace settle over your heart like the quiet dawn.',
      followUps: [
        'How can I honor a departed loved one in my daily spiritual practice?',
        'How do I overcome the dread of my own mortality or the aging of parents?',
        'What does the Gita teach about the journey of the soul after death?'
      ]
    };
  }

  // Default deep guidance for other verses (2.7, 18.63, 18.66, 3.35, etc.)
  return {
    explanation: `In this profound verse (${verse.citation}), Shree Krishna addresses one of the fundamental truths of human existence.

${verse.translation_english}

The teachings of the Gita do not ask us to run away from life's complexities into a forest. Instead, they provide us with a compass for living with dignity, integrity, and peace right in the midst of turmoil. Krishna teaches that when we act aligned with Dharma—our honest nature, our sincere duty, and universal compassion—we become free from the friction of ego and hesitation.

In BG 18.63, after imparting all wisdom, Krishna tells Arjuna: "Vimrishyaitad asheshena yathecchasi tatha kuru"—Ponder over this thoroughly, and then do as you choose. Krishna does not coerce; he empowers you to use your own discernment (Buddhi), anchored in sacred wisdom.`,
    connection: `Looking at what you are experiencing with "${problem.slice(0, 60)}...", this teaching reminds you that you do not need to have the entire staircase visible to take the next honest step. Align with what is true and unselfish, and the right path will illuminate itself.`,
    actions: [
      'Take 15 minutes of quiet reflection away from all screens and opinions to ask yourself: "What is the most honest, selfless next step here?"',
      'Choose the path of Dharma (integrity) over the path of mere convenience or temporary comfort.',
      'Offer the dilemmas and anxieties to the Divine, trusting that sincere intentions always bear noble fruit.'
    ],
    avoidances: [
      'Avoid making major life decisions out of sudden anger, panic, or social pressure.',
      'Avoid comparing your personal journey and timeline to anyone else\'s.'
    ],
    concludingThought: 'You carry within you the divine spark of strength and wisdom. Trust your sincere heart, take one righteous step at a time, and peace will be your companion.',
    followUps: [
      'How do I discern what my true Dharma (duty) is in this situation?',
      'How do I maintain inner conviction when others disagree with my choices?',
      'What simple daily prayer or mantra can I use for courage?'
    ]
  };
}
