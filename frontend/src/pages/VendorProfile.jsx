import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, MapPin, Clock } from 'lucide-react';
import API from '../api/axios';
import ServiceCard from '../components/ServiceCard';

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function VendorProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/users/vendor/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-16 text-ink/50 text-sm">Loading...</div>;
  if (!data) return <div className="max-w-4xl mx-auto px-6 py-16 text-ink/50 text-sm">Vendor not found.</div>;

  const { vendor, listings } = data;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white border border-hairline rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-route/10 text-route flex items-center justify-center font-display font-bold text-lg">
            {getInitials(vendor.name)}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-ink">
              {vendor.vendorInfo?.businessName || vendor.name}
            </h1>
            <p className="text-sm text-ink/60">{vendor.vendorInfo?.serviceType}</p>
          </div>
        </div>

        {vendor.vendorInfo?.serviceDescription && (
          <p className="text-sm text-ink/70 mb-4">{vendor.vendorInfo.serviceDescription}</p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-ink/70 border-t border-hairline pt-4">
          <span className="flex items-center gap-1.5">
            <Phone size={14} className="text-route" /> {vendor.mobileNumber}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-route" /> {vendor.address}
          </span>
          {vendor.vendorInfo?.serviceTiming && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-route" /> {vendor.vendorInfo.serviceTiming}
            </span>
          )}
        </div>
      </div>

      <h2 className="text-lg font-bold text-ink mb-4">Listings</h2>
      {listings.length === 0 ? (
        <p className="text-sm text-ink/50">No active listings yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {listings.map((s) => (
            <ServiceCard key={s._id} service={s} distance={null} />
          ))}
        </div>
      )}
    </div>
  );
}