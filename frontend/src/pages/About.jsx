import { Link } from 'react-router-dom';
import { Compass, HeartHandshake, MapPinned } from 'lucide-react';

const VALUES = [
  { icon: MapPinned, title: 'Local first', text: 'We help neighbours find the services that make daily life easier.' },
  { icon: HeartHandshake, title: 'Built on trust', text: 'Clear profiles and useful details help people choose with confidence.' },
  { icon: Compass, title: 'Simple by design', text: 'From discovery to connection, NearU keeps every step straightforward.' },
];

export default function About() {
  return (
    <main>
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-14 text-center">
        <p className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-route">About NearU</p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">A better way to find the people who keep your neighbourhood moving.</h1>
        <p className="mt-6 max-w-2xl mx-auto text-base text-ink/65 leading-relaxed">NearU connects people with local service providers, so finding help feels personal, quick, and dependable.</p>
      </section>
      <section className="bg-white border-y border-hairline"><div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-6">{VALUES.map(({ icon: Icon, title, text }) => <article key={title} className="p-6 rounded-2xl border border-hairline bg-paper"><div className="w-10 h-10 rounded-lg bg-amber/20 text-ink flex items-center justify-center"><Icon size={20} /></div><h2 className="mt-5 font-display font-bold text-xl text-ink">{title}</h2><p className="mt-2 text-sm text-ink/65 leading-relaxed">{text}</p></article>)}</div></section>
      <section className="max-w-4xl mx-auto px-6 py-16 text-center"><h2 className="font-display text-3xl font-bold text-ink">Ready to connect locally?</h2><Link to="/signup" className="inline-flex mt-6 bg-ink text-paper px-5 py-3 rounded-md text-sm font-semibold hover:bg-ink/90 transition-colors">Join NearU</Link></section>
    </main>
  );
}
