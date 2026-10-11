import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSpiritualGuidance, isGeminiConfigured } from './guidanceEngine.js';
import { searchVerses, getVerseByRef, getAllChapters, getVerseOfTheDay } from './retrieval.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;
const DIST_DIR = path.join(__dirname, '..', 'dist');

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // JSON helper
  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
  };

  try {
    // 1. Health & Status
    if (pathname === '/api/status' && req.method === 'GET') {
      return sendJson(200, {
        status: 'online',
        aiConfigured: isGeminiConfigured(),
        provider: isGeminiConfigured() ? 'Gemini 2.5 Flash with Verified Gita Grounding' : 'Local Scripture-Grounded Engine',
        totalVerses: 701,
        totalChapters: 18,
        disclaimer: 'Inspired spiritual reflection based on the Bhagavad Gita; does not claim divine personhood or authority.'
      });
    }

    // 2. Verse of the Day
    if (pathname === '/api/verse-of-the-day' && req.method === 'GET') {
      const verse = getVerseOfTheDay();
      return sendJson(200, {
        success: true,
        verse
      });
    }

    // 3. Chapters
    if (pathname === '/api/chapters' && req.method === 'GET') {
      const chapters = getAllChapters();
      return sendJson(200, {
        success: true,
        count: chapters.length,
        chapters
      });
    }

    // 4. Verses List or Search
    if (pathname === '/api/verses' && req.method === 'GET') {
      const { q, chapter, theme, limit } = parsedUrl.query;
      const results = searchVerses(q, chapter, theme, limit ? parseInt(limit, 10) : 30);
      return sendJson(200, {
        success: true,
        totalFound: results.length,
        verses: results
      });
    }

    // 5. Specific Verse Reference (e.g. /api/verses/2.47)
    const verseMatch = pathname.match(/^\/api\/verses\/(\d{1,2}\.\d{1,2})$/);
    if (verseMatch && req.method === 'GET') {
      const ref = verseMatch[1];
      const verse = getVerseByRef(ref);
      if (!verse) {
        return sendJson(404, { error: `Verse ${ref} not found in verified Bhagavad Gita dataset.` });
      }
      return sendJson(200, { success: true, verse });
    }

    // 6. Spiritual Guidance Generation (POST /api/guidance)
    if (pathname === '/api/guidance' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 50000) { // Protect against large payloads
          req.destroy();
        }
      });

      req.on('end', async () => {
        try {
          let parsedBody = {};
          try {
            parsedBody = JSON.parse(body);
          } catch {
            return sendJson(400, { error: 'Invalid JSON request payload.' });
          }

          const { problem, conversationHistory } = parsedBody;
          if (!problem || typeof problem !== 'string' || !problem.trim()) {
            return sendJson(400, { error: 'Please describe the situation or question on your mind.' });
          }

          if (problem.length > 3000) {
            return sendJson(400, { error: 'Your message exceeds the 3000-character limit. Please summarize your core concern.' });
          }

          const guidance = await generateSpiritualGuidance({
            problem: problem.trim(),
            conversationHistory: Array.isArray(conversationHistory) ? conversationHistory : []
          });

          return sendJson(200, {
            success: true,
            guidance
          });
        } catch (apiErr) {
          console.error('Guidance generation error:', apiErr);
          return sendJson(500, {
            error: 'An unexpected issue occurred while synthesizing scriptural guidance.',
            details: apiErr.message
          });
        }
      });
      return;
    }

    // 7. Serve Static Files from dist (if built and present)
    if (fs.existsSync(DIST_DIR)) {
      let filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);
      
      // If not exists directly, fall back to index.html for SPA routing
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(DIST_DIR, 'index.html');
      }

      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
          '.html': 'text/html; charset=utf-8',
          '.js': 'application/javascript; charset=utf-8',
          '.css': 'text/css; charset=utf-8',
          '.json': 'application/json; charset=utf-8',
          '.svg': 'image/svg+xml',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.ico': 'image/x-icon',
          '.woff2': 'font/woff2'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        return fs.createReadStream(filePath).pipe(res);
      }
    }

    // 404 for unknown endpoints
    sendJson(404, { error: `Endpoint not found: ${pathname}` });
  } catch (err) {
    console.error('Server error:', err);
    sendJson(500, { error: 'Internal server error', details: err.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Shree Krishna AI server running at http://localhost:${PORT}`);
  console.log(`AI Configuration status: ${isGeminiConfigured() ? 'Gemini API active' : 'Scripture-grounded local mode active'}`);
});
