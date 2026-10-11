import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');

const verses = JSON.parse(fs.readFileSync(path.join(dataDir, 'verses.json'), 'utf8'));
const verseLookup = JSON.parse(fs.readFileSync(path.join(dataDir, 'verse_lookup.json'), 'utf8'));
const chapters = JSON.parse(fs.readFileSync(path.join(dataDir, 'chapters.json'), 'utf8'));
const curatedTopics = JSON.parse(fs.readFileSync(path.join(dataDir, 'curated_topics.json'), 'utf8'));

export function getVerseByRef(ref) {
  // ref like "2.47" or { chapter: 2, verse: 47 }
  if (typeof ref === 'string') {
    return verseLookup[ref] || null;
  }
  if (ref && ref.chapter && ref.verse) {
    return verseLookup[`${ref.chapter}.${ref.verse}`] || null;
  }
  return null;
}

export function getAllChapters() {
  return chapters;
}

export function searchVerses(query = '', chapter = null, theme = null, limit = 20) {
  let results = verses;

  if (chapter) {
    const chNum = parseInt(chapter, 10);
    results = results.filter(v => v.chapter === chNum);
  }

  if (theme) {
    results = results.filter(v => v.themes && v.themes.includes(theme));
  }

  if (query && query.trim()) {
    const qLower = query.toLowerCase().trim();
    
    // Check if query is like "2.47" or "2:47"
    const refMatch = qLower.match(/^(\d{1,2})[.:](\d{1,2})$/);
    if (refMatch) {
      const targetRef = `${parseInt(refMatch[1], 10)}.${parseInt(refMatch[2], 10)}`;
      const exact = verseLookup[targetRef];
      return exact ? [exact] : [];
    }

    const words = qLower.split(/\s+/).filter(w => w.length > 2);
    results = results.filter(v => {
      const searchable = (
        (v.translation_english || '') + ' ' +
        (v.transliteration || '') + ' ' +
        (v.word_meanings || '') + ' ' +
        (v.citation || '') + ' ' +
        (v.slok || '')
      ).toLowerCase();

      return words.some(w => searchable.includes(w));
    });
  }

  return results.slice(0, limit);
}

export function retrieveVersesForProblem(userText) {
  if (!userText || !userText.trim()) {
    // Default to the flagship verse BG 2.47
    return {
      primary: verseLookup['2.47'],
      secondary: [verseLookup['6.5'], verseLookup['2.48']],
      topic: curatedTopics.find(t => t.id === 'career')
    };
  }

  const textLower = userText.toLowerCase();

  // 1. Direct Topic Match Scoring
  let bestTopic = null;
  let highestTopicScore = 0;

  for (const topic of curatedTopics) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (textLower.includes(kw)) {
        score += 3;
      }
    }
    // Check sample prompts similarity
    for (const sample of topic.samplePrompts) {
      const sampleWords = sample.toLowerCase().split(/\s+/);
      for (const sw of sampleWords) {
        if (sw.length > 3 && textLower.includes(sw)) {
          score += 1;
        }
      }
    }

    if (score > highestTopicScore) {
      highestTopicScore = score;
      bestTopic = topic;
    }
  }

  // 2. Keyword Search Scoring across all verses
  const verseScores = new Map();
  const tokens = textLower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length > 3);

  for (const v of verses) {
    let score = 0;
    const searchable = (
      (v.translation_english || '') + ' ' +
      (v.transliteration || '') + ' ' +
      (v.word_meanings || '')
    ).toLowerCase();

    for (const token of tokens) {
      if (searchable.includes(token)) {
        score += 2;
      }
    }

    if (score > 0) {
      verseScores.set(v.reference, score);
    }
  }

  // If a topic matched strongly, boost its primary & secondary verses
  if (bestTopic) {
    verseScores.set(bestTopic.primaryVerse, (verseScores.get(bestTopic.primaryVerse) || 0) + 20);
    for (const sec of bestTopic.secondaryVerses) {
      verseScores.set(sec, (verseScores.get(sec) || 0) + 10);
    }
  }

  // Sort verses by score
  const sortedRefs = Array.from(verseScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  let primaryRef = sortedRefs[0] || (bestTopic ? bestTopic.primaryVerse : '2.47');
  let secondaryRefs = sortedRefs.slice(1, 3);

  if (secondaryRefs.length === 0 && bestTopic) {
    secondaryRefs = bestTopic.secondaryVerses.slice(0, 2);
  }

  return {
    primary: verseLookup[primaryRef] || verseLookup['2.47'],
    secondary: secondaryRefs.map(r => verseLookup[r]).filter(Boolean),
    topic: bestTopic || curatedTopics[0]
  };
}

export function getVerseOfTheDay() {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  // Pick from famous inspirational verses
  const inspirationalRefs = [
    '2.47', '2.48', '2.50', '2.62', '2.63', '2.70',
    '3.35', '4.20', '5.18', '6.5', '6.6', '6.26', '6.35',
    '9.22', '9.29', '12.13', '12.14', '18.63', '18.66'
  ];
  const selectedRef = inspirationalRefs[dayOfYear % inspirationalRefs.length];
  return verseLookup[selectedRef] || verseLookup['2.47'];
}
