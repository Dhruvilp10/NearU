import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import API from '../api/axios';
import VendorCard from '../components/VendorCard';
import { calculateDistance } from '../utils/distance';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    fetchVendors();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const fetchVendors = async (query = '') => {
    setLoading(true);
    try {
      const res = await API.get('/users/vendors', { params: query ? { search: query } : {} });
      setVendors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVendors(search);
  };

  const vendorsWithDistance = vendors.map((v) => {
    let distance = null;
    if (userCoords && v.vendorInfo) {
      // Vendor location isn't stored on the User model, so distance shown here
      // is only meaningful once we cross-reference their Service listing.
    }
    return { ...v, distance };
  });

  const sorted = userCoords
    ? [...vendorsWithDistance]
    : vendorsWithDistance;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-ink mb-2 tracking-tight">Vendors</h1>
      <p className="text-sm text-ink/60 mb-6">Browse everyone offering services on NearU.</p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-md">
        <div className="flex-1 flex items-center gap-2 bg-white border border-hairline rounded-md px-3 py-2.5">
          <Search size={15} className="text-ink/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or service..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
        </div>
        <button type="submit" className="bg-ink text-paper text-sm font-medium px-4 py-2.5 rounded-md">
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-ink/50">Loading...</p>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-ink/50">No vendors found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sorted.map((v) => (
            <VendorCard key={v._id} vendor={v} distance={v.distance} />
          ))}
        </div>
      )}
    </div>
  );
}