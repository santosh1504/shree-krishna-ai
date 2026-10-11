export interface Translation {
  author: string;
  lang: string;
  text: string;
}

export interface Verse {
  id?: number;
  chapter: number;
  verse: number;
  citation: string;
  reference: string;
  slok: string;
  transliteration: string;
  word_meanings?: string;
  translation_english: string;
  translator_english: string;
  translation_hindi?: string;
  translator_hindi?: string;
  all_translations?: Translation[];
  themes: string[];
}

export interface Chapter {
  chapter_number: number;
  name_sanskrit: string;
  name_meaning: string;
  name_translation: string;
  name_transliterated: string;
  verses_count: number;
  summary: string;
  summary_hindi?: string;
}

export interface CuratedTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  samplePrompts: string[];
  keywords: string[];
  primaryVerse: string;
  secondaryVerses: string[];
}

export interface GuidanceSources {
  scripture: string;
  chapter: string;
  verse: string;
  translator: string;
  historicalNote?: string;
}

export interface GuidanceResponse {
  acknowledgment: string;
  sanskritShloka: string;
  chapterVerse: string;
  transliteration: string;
  englishTranslation: string;
  everydayExplanation: string;
  connectionToProblem: string;
  practicalActions: string[];
  thingsToAvoid: string[];
  concludingThought: string;
  sources: GuidanceSources;
  followUpSuggestions: string[];
  mode: string;
  providerDisclosed: string;
  verifiedVerse?: Verse;
  supportingVerses?: Verse[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  guidance?: GuidanceResponse;
  timestamp: number;
  error?: string;
}

export interface ApiStatus {
  status: string;
  aiConfigured: boolean;
  provider: string;
  totalVerses: number;
  totalChapters: number;
  disclaimer: string;
}
