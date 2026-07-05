import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function VendorCard({ vendor, distance }) {
  return (
    <Link
      to={`/vendor/${vendor._id}`}
      className="relative bg-white border border-hairline rounded-xl p-4 pt-5 block hover:border-route/40 transition-colors"
    >
      {distance !== null && distance !== undefined && (
        <div className="tag-pin absolute -top-2 right-4 bg-ink text-paper font-mono text-[11px] px-2.5 pt-1.5 pb-2.5">
          {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}
        </div>
      )}

      <div className="w-11 h-11 rounded-full bg-route/10 text-route flex items-center justify-center font-display font-bold text-sm mb-2.5">
        {getInitials(vendor.name)}
      </div>

      <p className="font-display font-bold text-sm text-ink mb-0.5 truncate">
        {vendor.vendorInfo?.businessName || vendor.name}
      </p>
      <p className="text-xs text-ink/60 flex items-center gap-1 mb-3.5">
        <Store size={11} /> {vendor.vendorInfo?.serviceType || 'Vendor'}
      </p>

      <span className="block w-full text-center border border-ink text-ink text-xs font-medium py-2 rounded-md">
        View profile
      </span>
    </Link>
  );
}