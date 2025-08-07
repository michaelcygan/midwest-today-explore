# Midwest Today — Explore Today (Starter)

A Next.js app you can deploy on Vercel and embed on your Squarespace homepage via an `<iframe>`.
- `/` shows a full-page demo.
- `/embed` is a minimal, chrome-free view designed for iframes.
- `/api/itinerary` returns a mocked itinerary so you can demo end-to-end today.

## Quick Deploy (Vercel)

1) Create a GitHub account if you don't have one.
2) Create a new public repo (e.g., `midwest-today-explore`).
3) Upload this folder's contents to that repo (GitHub → Add file → Upload files → drag-drop).
4) Go to vercel.com → Sign up with GitHub → "Add New Project" → Import your repo.
5) Framework: **Next.js**. Root directory: `/`. Build command: `next build` (default). Output: `.next` (default).
6) Deploy. Wait ~1–2 minutes.

Your URL will look like `https://midwest-today-explore.vercel.app`.  
Embed route: `https://midwest-today-explore.vercel.app/embed`.

## Squarespace Embed

Add a **Code Block** on your homepage and paste:

```html
<div style="max-width:1000px;margin:0 auto;">
  <iframe
    src="https://YOUR-VERCEL-URL.vercel.app/embed"
    title="Explore Today"
    style="width:100%;height:1000px;border:0;border-radius:16px;overflow:hidden"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
  ></iframe>
</div>
```

(Optional) If you want auto-resize, add this small script (Code Injection → Footer) and keep the fixed height as a fallback:

```html
<script>
  window.addEventListener('message', function(e){
    if (e.data && e.data.type === 'EXPLORE_TODAY_RESIZE') {
      const frames = document.querySelectorAll('iframe[title="Explore Today"]');
      frames.forEach(f => f.style.height = Math.max(700, e.data.height) + 'px');
    }
  });
</script>
```

## Roadmap to Live Data

Later, create server routes under `app/api/*` that call Google Places, Eventbrite, OpenTable, Ticketmaster, etc., with keys stored as **Vercel Project → Settings → Environment Variables**. Keep keys server-side only.

---

Built for Squarespace embedding. Clean, fast, and easy to theme via URL params:  
`/embed?accent=%230ea5e9&bg=%23f6f7fb&q=Chicago`