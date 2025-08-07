'use client';
import { useEffect, useMemo, useState } from 'react';

const THEMES = [
  'Art & Museums', 'Outdoors', 'Foodie', 'Live Music',
  'Vintage/Shopping', 'Hidden Gems', 'Family Friendly', 'Date Night'
];

export default function ExploreToday() {
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState(5);
  const [maxPrice, setMaxPrice] = useState(2);
  const [adultsOnly, setAdultsOnly] = useState(false);
  const [themes, setThemes] = useState(new Set(['Foodie', 'Hidden Gems']));
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState('');

  // Read brand/visual params (optional, from ?accent, ?bg, etc.)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accent = params.get('accent');
    const bg = params.get('bg');
    if (accent) document.documentElement.style.setProperty('--accent', accent);
    if (bg) document.documentElement.style.setProperty('--bg', bg);
    const start = params.get('q') || params.get('city') || params.get('zip') || '';
    if (start) setQuery(start);
  }, []);

  const themeToggles = useMemo(() => THEMES.map(t => ({
    name: t,
    checked: themes.has(t),
    toggle: () => {
      const next = new Set(themes);
      if (next.has(t)) next.delete(t); else next.add(t);
      setThemes(next);
    }
  })), [themes]);

  async function planDay() {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query, radius, maxPrice, adultsOnly, themes: [...themes]
        })
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setItinerary(data.items || []);
      // Tell parent (Squarespace) height changed (for optional auto-resize script)
      setTimeout(() => {
        const h = document.documentElement.scrollHeight;
        window.parent?.postMessage({ type: 'EXPLORE_TODAY_RESIZE', height: h }, '*');
      }, 50);
    } catch (e) {
      console.error(e);
      setError('Something went wrong planning your day. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <link rel="stylesheet" href="/app/globals.css" />
      <div className="panel">
        <div className="grid" style={{ marginBottom: 8 }}>
          <div className="field" style={{ gridColumn: 'span 6' }}>
            <label className="label">City / Zip / Neighborhood</label>
            <input className="input" placeholder="e.g., Chicago, 60614, North Loop"
                   value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="field" style={{ gridColumn: 'span 3' }}>
            <label className="label">Radius (miles)</label>
            <input type="number" className="input" min="1" max="50"
                   value={radius} onChange={e => setRadius(Number(e.target.value || 0))} />
          </div>
          <div className="field" style={{ gridColumn: 'span 3' }}>
            <label className="label">Max Price</label>
            <select className="select" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}>
              <option value={1}>$ (budget)</option>
              <option value={2}>$$ (mid)</option>
              <option value={3}>$$$ (nice)</option>
              <option value={4}>$$$$ (splurge)</option>
            </select>
          </div>
        </div>

        <div className="grid" style={{ marginBottom: 8 }}>
          <div className="field" style={{ gridColumn: 'span 6' }}>
            <label className="label">Themes</label>
            <div className="row">
              {themeToggles.map(t => (
                <button key={t.name} onClick={t.toggle}
                        className="badge"
                        aria-pressed={t.checked}
                        style={{ borderColor: t.checked ? 'var(--accent)' : 'var(--border)',
                                 background: t.checked ? 'rgba(14,165,233,0.10)' : '#f1f5f9' }}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>
          <div className="field" style={{ gridColumn: 'span 3' }}>
            <label className="label">21+ Only</label>
            <select className="select"
                    value={adultsOnly ? 'yes' : 'no'}
                    onChange={e => setAdultsOnly(e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div className="field" style={{ gridColumn: 'span 3', alignSelf: 'end' }}>
            <button className="btn" onClick={planDay} disabled={loading}>
              {loading ? 'Planning…' : 'Plan my day'}
            </button>
          </div>
        </div>
      </div>

      <div className="spacer" />

      {error && <div className="panel" style={{ borderColor: '#fecaca', background: '#fff1f2' }}>{error}</div>}

      {itinerary.length > 0 && (
        <div className="itin">
          {itinerary.map((slot, idx) => (
            <div key={idx} className="card">
              <div className="row">
                <span className="badge">{slot.time}</span>
                <span className="badge">{slot.type}</span>
                {slot.price && <span className="badge">{slot.price}</span>}
                {slot.age && <span className="badge">{slot.age}</span>}
              </div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{slot.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 14 }}>{slot.description}</div>
              <div className="row">
                {slot.booking && <a className="btn" href={slot.booking} target="_blank" rel="noreferrer">Reserve / Tickets</a>}
                {slot.website && <a className="btn secondary" href={slot.website} target="_blank" rel="noreferrer">Website</a>}
                {slot.address && <a className="btn secondary" href={"https://maps.google.com/?q=" + encodeURIComponent(slot.address)} target="_blank" rel="noreferrer">Map</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}