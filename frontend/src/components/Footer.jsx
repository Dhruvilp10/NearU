import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-amber text-ink rounded-md p-1">
            <MapPin size={14} strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-sm text-paper">
            Near<span className="text-route brightness-150">U</span>
          </span>
          <span className="text-xs text-paper/40 ml-2">© 2026</span>
        </div>
        <div className="flex gap-6 text-xs text-paper/60">
          <Link to="/faq" className="hover:text-amber transition-colors">FAQ</Link>
          <Link to="/contact" className="hover:text-amber transition-colors">Contact us</Link>
        </div>
      </div>
    </footer>
  );
}