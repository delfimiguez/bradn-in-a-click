# Brand in a Click

Generate three fully-formed brand directions instantly using AI.

## Stack

- React 18
- Vite
- Tailwind CSS 3
- Anthropic Claude API (claude-sonnet-4)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deploy to Vercel

### Option A — via Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option B — via GitHub

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo
4. No build settings needed — Vercel auto-detects Vite
5. Deploy

> The app calls the Anthropic API directly from the browser.
> No environment variables needed for deployment.

## Notes

- The API key is injected by the Claude.ai artifact environment.
  If running outside of Claude.ai, you will need to proxy requests through
  a backend to avoid exposing your API key in the browser.
- Build output goes to `dist/`
