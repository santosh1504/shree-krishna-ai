import { GuidanceResponse, Verse, Chapter, ApiStatus } from '../types';
import { 
  loadClientVerses, 
  loadClientChapters, 
  searchClientVerses, 
  getClientVerseByRef, 
  getClientVerseOfTheDay, 
  generateClientGuidance 
} from './clientFallback';

const API_BASE = '/api';

export async function getApiStatus(): Promise<ApiStatus> {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('Status endpoint failed');
    return await res.json();
  } catch (err) {
    return {
      status: 'online',
      aiConfigured: false,
      provider: 'Self-Contained Scripture Grounding (Universal Static & Cloud Mode)',
      totalVerses: 701,
      totalChapters: 18,
      disclaimer: 'Scripture-grounded reflection inspired by the Bhagavad Gita.'
    };
  }
}

export async function getVerseOfTheDay(): Promise<Verse> {
  try {
    const res = await fetch(`${API_BASE}/verse-of-the-day`);
    if (!res.ok) throw new Error('Failed to load verse from API');
    const data = await res.json();
    return data.verse;
  } catch {
    return await getClientVerseOfTheDay();
  }
}

export async function getChapters(): Promise<Chapter[]> {
  try {
    const res = await fetch(`${API_BASE}/chapters`);
    if (!res.ok) throw new Error('Failed to load chapters from API');
    const data = await res.json();
    return data.chapters;
  } catch {
    return await loadClientChapters();
  }
}

export async function searchVerses(params: { q?: string; chapter?: number | string; theme?: string; limit?: number }): Promise<Verse[]> {
  try {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.chapter) query.set('chapter', String(params.chapter));
    if (params.theme) query.set('theme', params.theme);
    if (params.limit) query.set('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/verses?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to search verses via API');
    const data = await res.json();
    return data.verses || [];
  } catch {
    return await searchClientVerses(params);
  }
}

export async function getVerseByRef(ref: string): Promise<Verse> {
  try {
    const res = await fetch(`${API_BASE}/verses/${encodeURIComponent(ref)}`);
    if (!res.ok) throw new Error(`Verse ${ref} not found via API`);
    const data = await res.json();
    return data.verse;
  } catch {
    const verse = await getClientVerseByRef(ref);
    if (!verse) throw new Error(`Verse ${ref} not found`);
    return verse;
  }
}

export async function askGuidance(problem: string, conversationHistory: any[] = []): Promise<GuidanceResponse> {
  try {
    const res = await fetch(`${API_BASE}/guidance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem,
        conversationHistory: conversationHistory.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.guidance) {
        return data.guidance;
      }
    }
  } catch (err) {
    // API endpoint unreachable (e.g. running on static host like Netlify Drop / GitHub Pages)
  }

  // Graceful, instant client-side scripture grounding fallback!
  return await generateClientGuidance(problem);
}
