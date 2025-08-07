import { NextResponse } from 'next/server';

const MOCK = [
  { time: '8:30 AM', type: 'Coffee & Pastry', title: 'Local Roasters Cafe', price: '$', age: 'All ages',
    description: 'Order a cappuccino and cardamom bun; grab a window seat to map your morning.',
    website: 'https://example.com/roasters', booking: null, address: '123 Main St' },
  { time: '10:00 AM', type: 'Museum/Exhibit', title: 'Design & Craft Museum', price: '$$',
    description: 'Rotating exhibits on Midwest design history; compact and inspiring.',
    website: 'https://example.com/museum', booking: 'https://tickets.example.com/museum', address: '200 Museum Way' },
  { time: '12:15 PM', type: 'Lunch', title: 'Smashburger & Shakes', price: '$$',
    description: 'Smash patties, crinkle fries, and a seasonal shake; vegetarian options.',
    website: 'https://example.com/burger', booking: null, address: '88 Lakeview Ave' },
  { time: '2:00 PM', type: 'Neighborhood Walk', title: 'Riverside Promenade', price: '$',
    description: 'Scenic 1.5‑mile path with public art and skyline views.',
    website: 'https://example.com/riverwalk', booking: null, address: 'Riverside Promenade' },
  { time: '4:00 PM', type: 'Coffee or Cocktail', title: 'Atrium Bar', price: '$$',
    description: 'Sun‑lit atrium lounge; mocktails and classics.',
    website: 'https://example.com/atrium', booking: null, address: '15 Market St' },
  { time: '7:30 PM', type: 'Show', title: 'Indie Venue — Tonight Only', price: '$$',
    description: 'Live set at a beloved small venue; tickets often sell out same‑day.',
    website: 'https://example.com/venue', booking: 'https://tickets.example.com/venue', address: '400 Music Hall Rd' }
];

export async function POST(req){
  const body = await req.json().catch(() => ({}));
  const { query = '', radius = 5, maxPrice = 2, adultsOnly = false, themes = [] } = body || {};
  // For now return mock data; later, call Google Places/Eventbrite/OpenTable with secure keys.
  // We echo filters so you can verify wiring.
  const items = MOCK.map(x => ({ ...x }));
  return NextResponse.json({ items, debug: { query, radius, maxPrice, adultsOnly, themes } });
}

export async function GET(req){
  // Allow simple GET for testing with query params
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const radius = Number(searchParams.get('radius') || 5);
  const maxPrice = Number(searchParams.get('maxPrice') || 2);
  const adultsOnly = (searchParams.get('adultsOnly') || 'false') === 'true';
  const themes = (searchParams.get('themes') || '').split(',').filter(Boolean);
  const items = MOCK.map(x => ({ ...x }));
  return NextResponse.json({ items, debug: { query, radius, maxPrice, adultsOnly, themes } });
}