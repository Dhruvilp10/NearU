import { Link } from 'react-router-dom';

const BENEFITS = [
  ['Discover nearby', 'Find services that fit your area and your day.'],
  ['Choose confidently', 'View clear details before you get in touch.'],
  ['Grow locally', 'Create a vendor profile and reach your community.'],
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-12 items-center">
          <div>
            <p className="inline-flex text-xs font-mono font-semibold uppercase tracking-[0.18em] text-route bg-route/10 rounded-full px-3 py-2 mb-6">Your neighbourhood, connected</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight leading-[1.05]">Good local help is <span className="text-route">closer</span> than you think.</h1>
            <p className="mt-6 text-base sm:text-lg text-ink/65 leading-relaxed max-w-xl">NearU makes it simple to find dependable local professionals, from home repairs to everyday services, all in one trusted place.</p>
            <div className="flex flex-wrap gap-3 mt-8"><Link to="/signup" className="bg-amber text-ink px-5 py-3 rounded-md font-semibold text-sm hover:bg-amber/90 transition-colors">Create an account</Link><Link to="/login" className="bg-white border border-hairline text-ink px-5 py-3 rounded-md font-semibold text-sm hover:border-ink/40 transition-colors">Log in</Link></div>
          </div>
          <div className="relative bg-ink rounded-3xl p-7 sm:p-9 shadow-xl shadow-ink/10"><div className="absolute -top-5 -right-4 w-20 h-20 rounded-full bg-amber/90" /><div className="relative bg-paper rounded-2xl p-5 sm:p-6"><p className="text-xs font-mono uppercase tracking-wider text-route mb-3">Made for everyday life</p><h2 className="font-display text-2xl font-bold text-ink">Find the right help, right when you need it.</h2><div className="mt-6 space-y-3">{['Browse verified local services', 'Compare providers near your location', 'Manage your profile in one place'].map((item, index) => <div key={item} className="flex items-center gap-3 bg-white border border-hairline rounded-xl px-4 py-3"><span className="w-7 h-7 rounded-full bg-route/10 text-route text-xs font-bold flex items-center justify-center">0{index + 1}</span><span className="text-sm font-medium text-ink/80">{item}</span></div>)}</div></div></div>
        </div>
      </section>
      <section className="border-y border-hairline bg-white"><div className="max-w-6xl mx-auto px-6 py-14 grid sm:grid-cols-3 gap-8">{BENEFITS.map(([title, description]) => <div key={title} className="border-l-2 border-amber pl-4"><h2 className="font-display font-bold text-lg text-ink">{title}</h2><p className="mt-2 text-sm text-ink/60 leading-relaxed">{description}</p></div>)}</div></section>
    </main>
  );
}
