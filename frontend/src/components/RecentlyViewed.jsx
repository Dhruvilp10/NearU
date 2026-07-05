import { useEffect, useState } from 'react';
import API from '../api/axios';
import ServiceCard from './ServiceCard';

export default function RecentlyViewed() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (ids.length === 0) return;

    Promise.all(
      ids.map((id) => API.get(`/services/${id}`).then((res) => res.data).catch(() => null))
    ).then((results) => {
      setServices(results.filter(Boolean));
    });
  }, []);

  if (services.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-baseline justify-between mb-4">
        <span className="font-display font-bold text-sm text-ink">Recently viewed</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.map((s) => (
          <ServiceCard key={s._id} service={s} distance={null} />
        ))}
      </div>
    </div>
  );
}