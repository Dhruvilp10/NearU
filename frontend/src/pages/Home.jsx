import { useEffect, useState } from 'react';
import { LocateFixed } from 'lucide-react';
import API from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import { calculateDistance } from '../utils/distance';
import RecentlyViewed from '../components/RecentlyViewed';

const CATEGORIES = ['All', 'Electrician', 'Plumber', 'Laundry', 'Tiffin Service', 'Tutor', 'Salon'];

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [userCoords, setUserCoords] = useState(null);
  const [radius, setRadius] = useState(5);
  const [locating, setLocating] = useState(false);
  const [nearMode, setNearMode] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await API.get('/services/all');
      setServices(res.data);
      setNearMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFindNearMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ latitude, longitude });
        setNearMode(true);
        await fetchNearby(latitude, longitude, radius);
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const fetchNearby = async (lat, lon, km) => {
    setLoading(true);
    try {
      const res = await API.get('/services/nearby/search', {
        params: { latitude: lat, longitude: lon, maxDistance: km * 1000 },
      });
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (e) => {
    const km = Number(e.target.value);
    setRadius(km);
    if (userCoords) fetchNearby(userCoords.latitude, userCoords.longitude, km);
  };

  const filtered = services.filter((s) => category === 'All' || s.category === category);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-ink mb-2 tracking-tight">
          Find trusted help, right around the corner.
        </h1>
        <p className="text-sm text-ink/60 max-w-lg">
          Electricians, tiffin services, tutors and more — added and reviewed by people near you.
        </p>
      </div>

      <div className="bg-white border border-hairline rounded-xl p-4 mb-8 max-w-xl">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={handleFindNearMe}
            className="flex items-center gap-2 bg-ink text-paper text-sm font-medium px-4 py-2.5 rounded-md hover:bg-ink/90 transition-colors"
          >
            <LocateFixed size={15} />
            {locating ? 'Locating...' : 'Find near me'}
          </button>
          {nearMode && <span className="text-xs text-route font-mono">Showing results near you</span>}
        </div>

        {nearMode && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink/60 whitespace-nowrap">Search radius</span>
            <input
              type="range"
              min="1"
              max="20"
              value={radius}
              onChange={handleRadiusChange}
              className="flex-1 accent-route"
            />
            <span className="text-xs font-mono text-ink w-12 text-right">{radius} km</span>
          </div>
        )}
      </div>

   <RecentlyViewed />

      <div className="flex gap-2 mb-6 flex-wrap"></div>
      
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`text-xs font-medium px-3.5 py-2 rounded-full border transition-colors ${
              category === c
                ? 'bg-ink text-paper border-ink'
                : 'bg-white text-ink/70 border-hairline hover:border-ink/30'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex items-baseline justify-between mb-4">
        <span className="font-display font-bold text-sm text-ink">
          {nearMode ? 'Near you' : 'All services'}
        </span>
        <span className="text-xs font-mono text-route">{filtered.length} results</span>
      </div>

      {loading ? (
        <p className="text-sm text-ink/50">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-ink/50">No services found yet. Be the first to add one.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              distance={
                userCoords
                  ? calculateDistance(
                      userCoords.latitude,
                      userCoords.longitude,
                      service.location.coordinates[1],
                      service.location.coordinates[0]
                    )
                  : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}