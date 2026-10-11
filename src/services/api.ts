import { GuidanceResponse, Verse, Chapter, ApiStatus } from '../types';

const API_BASE = '/api';

export async function getApiStatus(): Promise<ApiStatus> {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('Status endpoint failed');
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      aiConfigured: false,
      provider: 'Local Fallback',
      totalVerses: 701,
      totalChapters: 18,
      disclaimer: 'Scripture-grounded reflection inspired by the Bhagavad Gita.'
    };
  }
}

export async function getVerseOfTheDay(): Promise<Verse> {
  const res = await fetch(`${API_BASE}/verse-of-the-day`);
  if (!res.ok) throw new Error('Failed to load verse of the day');
  const data = await res.json();
  return data.verse;
}

export async function getChapters(): Promise<Chapter[]> {
  const res = await fetch(`${API_BASE}/chapters`);
  if (!res.ok) throw new Error('Failed to load chapters');
  const data = await res.json();
  return data.chapters;
}

export async function searchVerses(params: { q?: string; chapter?: number | string; theme?: string; limit?: number }): Promise<Verse[]> {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.chapter) query.set('chapter', String(params.chapter));
  if (params.theme) query.set('theme', params.theme);
  if (params.limit) query.set('limit', String(params.limit));

  const res = await fetch(`${API_BASE}/verses?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to search verses');
  const data = await res.json();
  return data.verses || [];
}

export async function getVerseByRef(ref: string): Promise<Verse> {
  const res = await fetch(`${API_BASE}/verses/${encodeURIComponent(ref)}`);
  if (!res.ok) throw new Error(`Verse ${ref} not found`);
  const data = await res.json();
  return data.verse;
}

export async function askGuidance(problem: string, conversationHistory: any[] = []): Promise<GuidanceResponse> {
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

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Failed to generate guidance' }));
    throw new Error(errorData.error || errorData.details || 'Unable to connect to spiritual guidance service.');
  }

  const data = await res.json();
  if (!data.success || !data.guidance) {
    throw new Error(data.error || 'Invalid guidance response structure.');
  }

  return data.guidance;
}
