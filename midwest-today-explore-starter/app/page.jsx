import './globals.css';
import ExploreToday from './components/ExploreToday';

export default function Page() {
  return (
    <main>
      <section className="hero">
        <h1 className="h1">What are you doing today, Midwest?</h1>
        <p className="sub">A clean, fast day‑planner that curates breakfast-to-night itineraries around your city or neighborhood. One click to book the good stuff.</p>
      </section>
      <ExploreToday />
    </main>
  );
}