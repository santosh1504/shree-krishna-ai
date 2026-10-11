import { GuidanceResponse, Verse, Chapter } from '../types';
import curatedTopicsData from '../data/curated_topics.json';

let cachedVerses: Verse[] | null = null;
let cachedChapters: Chapter[] | null = null;
let verseLookup: Record<string, Verse> = {};

export async function loadClientVerses(): Promise<Verse[]> {
  if (cachedVerses) return cachedVerses;
  try {
    const res = await fetch('/data/verses.json');
    if (!res.ok) throw new Error('Failed to load verses data');
    const data: Verse[] = await res.json();
    cachedVerses = data;
    for (const v of data) {
      verseLookup[`${v.chapter}.${v.verse}`] = v;
    }
    return data;
  } catch (err) {
    console.error('Error loading client verses:', err);
    return [];
  }
}

export async function loadClientChapters(): Promise<Chapter[]> {
  if (cachedChapters) return cachedChapters;
  try {
    const res = await fetch('/data/chapters.json');
    if (!res.ok) throw new Error('Failed to load chapters data');
    const data: Chapter[] = await res.json();
    cachedChapters = data;
    return data;
  } catch (err) {
    console.error('Error loading client chapters:', err);
    return [];
  }
}

export async function getClientVerseByRef(ref: string): Promise<Verse | null> {
  await loadClientVerses();
  return verseLookup[ref] || null;
}

export async function searchClientVerses(params: { q?: string; chapter?: number | string; theme?: string; limit?: number }): Promise<Verse[]> {
  const allVerses = await loadClientVerses();
  let results = allVerses;

  if (params.chapter) {
    const chNum = Number(params.chapter);
    results = results.filter(v => v.chapter === chNum);
  }

  if (params.theme) {
    results = results.filter(v => v.themes && v.themes.includes(params.theme!));
  }

  if (params.q && params.q.trim()) {
    const qLower = params.q.toLowerCase().trim();
    const refMatch = qLower.match(/^(\d{1,2})[.:](\d{1,2})$/);
    if (refMatch) {
      const targetRef = `${parseInt(refMatch[1], 10)}.${parseInt(refMatch[2], 10)}`;
      const exact = verseLookup[targetRef];
      return exact ? [exact] : [];
    }

    const words = qLower.split(/\s+/).filter(w => w.length > 2);
    results = results.filter(v => {
      const text = ((v.translation_english || '') + ' ' + (v.transliteration || '') + ' ' + (v.slok || '')).toLowerCase();
      return words.some(w => text.includes(w));
    });
  }

  return results.slice(0, params.limit || 30);
}

export async function getClientVerseOfTheDay(): Promise<Verse> {
  const allVerses = await loadClientVerses();
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const refs = ['2.47', '2.48', '2.50', '2.62', '2.63', '3.35', '5.18', '6.5', '6.6', '6.26', '6.35', '9.22', '12.13', '18.66'];
  const targetRef = refs[dayOfYear % refs.length];
  return verseLookup[targetRef] || allVerses[0] || {
    chapter: 2,
    verse: 47,
    citation: 'Chapter 2, Verse 47',
    reference: '2.47',
    slok: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
    transliteration: 'karmaṇyevādhikāraste mā phaleṣhu kadāchana',
    translation_english: 'Your right is only to perform your duty, never to the fruits of action.',
    translator_english: 'Swami Sivananda',
    themes: ['action_and_duty']
  };
}

export async function generateClientGuidance(problem: string): Promise<GuidanceResponse> {
  const allVerses = await loadClientVerses();
  const pLower = problem.toLowerCase();

  // Find best topic
  let bestTopic = curatedTopicsData[0];
  let highestScore = 0;

  for (const topic of curatedTopicsData) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (pLower.includes(kw)) score += 3;
    }
    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  const primaryVerse = verseLookup[bestTopic.primaryVerse] || verseLookup['2.47'] || allVerses[0];
  const ref = `${primaryVerse.chapter}.${primaryVerse.verse}`;

  // Tailored warm acknowledgment
  let acknowledgment = 'I hear the sincerity and vulnerability in what you are walking through. In moments when life feels heavy, the teachings of the Bhagavad Gita meet us not with dogma, but with the compassionate embrace of eternal truth.';
  if (pLower.includes('overthinking') || pLower.includes('anxiety') || pLower.includes('mind')) {
    acknowledgment = 'It takes real courage to pause and acknowledge when your thoughts feel overwhelming. You are not weak for experiencing anxiety; even Arjuna, the greatest warrior of his age, sat down trembling and overwhelmed by grief on the battlefield.';
  } else if (pLower.includes('grief') || pLower.includes('loss') || pLower.includes('death')) {
    acknowledgment = 'I hold deep compassion for the ache in your heart right now. Grief is love with nowhere to go, but the ancient perspective of the Gita offers a sanctuary of enduring comfort for your soul.';
  } else if (pLower.includes('career') || pLower.includes('fail') || pLower.includes('job') || pLower.includes('exam')) {
    acknowledgment = 'I hear how heavy the fear of failure and the weight of unmet expectations feel today. Know with certainty that your sacred worth is not defined by any worldly score or temporary outcome.';
  } else if (pLower.includes('relationship') || pLower.includes('heartbreak') || pLower.includes('trust')) {
    acknowledgment = 'Heartache from broken trust or shifting relationships is one of the deepest pains we face as humans. Your feelings are completely valid, and it is natural to feel hurt when attachment meets friction.';
  }

  // Tailored detailed explanation
  let explanation = `In this timeless verse (${primaryVerse.citation}), Shree Krishna provides a foundational principle for cultivating inner stability and peace.

${primaryVerse.translation_english}

The teachings of the Gita do not ask you to renounce your duties or escape from the world. Rather, they teach you how to remain centered in your own dignity while navigating storms. Krishna reveals that our suffering almost always comes from attaching our happiness to external outcomes that we cannot completely control. When we shift our focus from "what will I get?" to "what is the most honest, sincere effort I can make right now?", our anxiety naturally dissolves.`;

  if (ref === '2.47') {
    explanation = `In this foundational verse, Shree Krishna addresses the exact root of chronic stress: our tendency to obsess over outcomes that are outside our absolute control.

Krishna explains that human existence operates on two levels: your sphere of action (which belongs entirely to you), and the sphere of results (which is influenced by countless external forces, circumstances, and time). When you pour yourself completely into today's sincere duty, your mind is potent and peaceful. But the moment you demand a specific reward or praise from the world, you invite fear, paralysis, and disappointment.

Importantly, Krishna clarifies: "Let not your attachment be to inaction." Renouncing attachment does not mean apathy; it means acting with full heart and dedication while trusting that life will unfold in its rightful time.`;
  } else if (ref === '6.35' || ref === '6.5') {
    explanation = `When Arjuna confessed that his mind felt as wild and untamable as the storm, Krishna did not judge him. Instead, Krishna nodded with deep empathy: "Yes, the mind is indeed restless and hard to curb."

Krishna then offered the two master keys: Abhyasa (patient, regular practice) and Vairagya (healthy detachment).

Abhyasa means that whenever your thoughts spiral into worry or catastrophe, you do not punish yourself. You gently, repeatedly escort your attention back to the present moment. Vairagya means learning to view thoughts as passing weather rather than unquestionable truths that you must believe.`;
  } else if (ref === '12.13') {
    explanation = `In this verse, Krishna describes the heart of one who is deeply peaceful. The foremost quality is Adveshta Sarva-bhutanam—holding hatred toward none, and being Maitrah (friendly) and Karuna (compassionate) to all beings.

Krishna explains that peace in relationships begins when we release Nirmamo (possessiveness) and Nirahankara (rigid pride). When we accept others as sovereign souls with their own wounds and journeys, we no longer need them to validate us, and we are freed from the bitterness of resentment.`;
  }

  const connection = `Regarding your situation with "${problem.slice(0, 70)}...", this teaching reminds you that you do not need to solve the entire future all at once. By returning your focus to what is sincere and within your direct control right now, you regain your inner equilibrium.`;

  return {
    acknowledgment,
    sanskritShloka: primaryVerse.slok,
    chapterVerse: `Chapter ${primaryVerse.chapter}, Verse ${primaryVerse.verse}`,
    transliteration: primaryVerse.transliteration,
    englishTranslation: primaryVerse.translation_english,
    everydayExplanation: explanation,
    connectionToProblem: connection,
    practicalActions: [
      'Take 3 conscious, slow breaths right now and anchor your mind in the immediate present.',
      'Identify the single next sincere action within your direct control today and do it with care.',
      'Release the mental urge to demand guarantees from the future; offer your sincere efforts with gratitude.'
    ],
    thingsToAvoid: [
      'Avoid ruminating obsessively over past regrets or hypothetical worst-case scenarios.',
      'Avoid comparing your personal journey and timeline to anyone else\'s.'
    ],
    concludingThought: 'You carry within you an enduring spark of divine resilience and clarity. Walk forward with peace in your heart; you are never walking alone.',
    sources: {
      scripture: 'Shrimad Bhagavad Gita',
      chapter: `Chapter ${primaryVerse.chapter} (${bestTopic.title})`,
      verse: `Verse ${primaryVerse.verse}`,
      translator: primaryVerse.translator_english || 'Swami Sivananda',
      historicalNote: 'Original Sanskrit text from the critical recension of the Mahabharata (Bhishma Parva).'
    },
    followUpSuggestions: [
      'How do I maintain inner calm when life feels overwhelming?',
      'What does healthy detachment mean in everyday family and work life?',
      'How can I discern what my true Dharma (duty) is right now?'
    ],
    mode: 'client_scripture_grounded',
    providerDisclosed: 'Self-Contained Scripture-Grounded Engine (Instant Static & Cloud Compatible)',
    verifiedVerse: primaryVerse
  };
}
