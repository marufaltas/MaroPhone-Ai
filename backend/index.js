const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'users.json');

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// نقطة بداية API بسيطة
app.get('/', (req, res) => {
  res.json({ msg: 'Smart Android Fix API' });
});

app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const users = readUsers();
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'User exists' });
  const user = { id: Date.now(), name, email, password };
  users.push(user);
  writeUsers(users);
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ id: user.id, name: user.name, email: user.email });
});

// إضافة نقطة نهاية /api/ask-ai (رد تجريبي لتفادي أخطاء الشبكة أثناء التطوير)
app.post('/api/ask-ai', async (req, res) => {
  const { prompt, device, androidVersion } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  const apiKey = process.env.GEN_API_KEY;
  const finalPrompt = `You are an expert Android repair assistant. Device: ${device || 'unknown'}; Android: ${androidVersion || 'unknown'};\nUser problem: ${prompt}\nProvide: 1) Possible causes, 2) Step-by-step fixes (simple), 3) If hardware related mention it. Keep answers in Arabic.`;

  if (!apiKey) {
    console.log('[ask-ai] mock reply for prompt:', (prompt || '').slice(0, 120));
    return res.json({ reply: `رد تجريبي: استلمنا سؤالك عن ${device || 'جهاز غير محدد'} (Android ${androidVersion || 'غير محدد'}).\nنقطة: شغّل الخادم الحقيقي مع مفتاح GEN_API_KEY لتلقي رد عملي.` });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro:generateContent?key=${apiKey}`;
    const body = { prompt: { text: finalPrompt } };

    const nodeFetch = (typeof fetch === 'undefined') ? (await import('node-fetch')).default : fetch;
    const r = await nodeFetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) {
      const text = await r.text();
      console.error('Generative API error', r.status, text);
      return res.status(502).json({ error: 'Generative API error', details: text });
    }
    const data = await r.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.output?.[0]?.content || JSON.stringify(data);
    return res.json({ reply });
  } catch (err) {
    console.error('ask-ai proxy error', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// لاحقاً: إضافة مسارات الأجهزة، المستخدمين، تسجيل الدخول، إلخ

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('API running on', PORT));
