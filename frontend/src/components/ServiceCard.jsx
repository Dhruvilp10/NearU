import { Link } from 'react-router-dom';
import { Zap, Shirt, Wrench, UtensilsCrossed, BookOpen, Scissors, Store, Star } from 'lucide-react';

const CATEGORY_ICONS = {
  Electrician: Zap,
  Laundry: Shirt,
  Plumber: Wrench,
  'Tiffin Service': UtensilsCrossed,
  Tutor: BookOpen,
  Salon: Scissors,
};

const STATUS_STYLES = {
  Open: 'bg-route/10 text-route',
  Busy: 'bg-amber/20 text-amber',
  Closed: 'bg-clay/10 text-clay',
};

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ServiceCard({ service, distance }) {
  const Icon = CATEGORY_ICONS[service.category] || Store;

  return (
    <Link
      to={`/service/${service._id}`}
      className="relative bg-white border border-hairline rounded-xl p-4 pt-5 block hover:border-route/40 transition-colors"
    >
      {distance !== null && distance !== undefined && (
        <div className="tag-pin absolute -top-2 right-4 bg-ink text-paper font-mono text-[11px] px-2.5 pt-1.5 pb-2.5">
          {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}
        </div>
      )}

      <div className="flex items-start justify-between mb-2.5">
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-route/10 text-route flex items-center justify-center font-display font-bold text-sm">
            {getInitials(service.name)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full bg-ink flex items-center justify-center border-2 border-white">
            <Icon size={10} className="text-amber" />
          </div>
        </div>
        <span className={`text-[10px] font-medium px-2 py-1 rounded ${STATUS_STYLES[service.status] || STATUS_STYLES.Open}`}>
          {service.status}
        </span>
      </div>

      <p className="font-display font-bold text-sm text-ink mb-0.5 truncate">{service.name}</p>
      <div className="flex items-center gap-1 mb-0.5">
        <Star size={11} className="text-amber fill-amber" />
        <span className="text-xs font-mono text-ink">{service.avgRating || '—'}</span>
      </div>
      <p className="text-xs text-ink/60 mb-3.5">{service.category}</p>

      <span className="block w-full text-center border border-ink text-ink text-xs font-medium py-2 rounded-md">
        More details
      </span>
    </Link>
  );
}