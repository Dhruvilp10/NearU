import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Phone, Clock, Flag, Trash2, Star, Store } from 'lucide-react';
import API from '../api/axios';

const STATUS_STYLES = {
  Open: 'bg-route/10 text-route',
  Busy: 'bg-amber/20 text-amber',
  Closed: 'bg-clay/10 text-clay',
};

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [serviceRes, reviewsRes] = await Promise.all([
        API.get(`/services/${id}`),
        API.get(`/reviews/${id}`),
      ]);
      setService(serviceRes.data);
      setReviews(reviewsRes.data);
      addToRecentlyViewed(id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToRecentlyViewed = (serviceId) => {
    const existing = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const updated = [serviceId, ...existing.filter((sid) => sid !== serviceId)].slice(0, 5);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  const isOwner = currentUser && service && service.addedBy === currentUser.id;

  const handleStatusChange = async (status) => {
    try {
      await API.put(`/services/${id}/status`, { status });
      setService((s) => ({ ...s, status }));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update status.');
    }
  };

  const handleReport = async () => {
    if (!window.confirm('Report this listing as inaccurate or spam?')) return;
    try {
      await API.put(`/services/${id}/report`);
      alert('Thanks — this listing has been flagged for review.');
    } catch (err) {
      alert('Could not report this listing.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      await API.delete(`/services/${id}`);
      navigate('/');
    } catch (err) {
      alert('Could not delete this listing.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/reviews/add', { serviceId: id, ...reviewForm });
      setReviewForm({ rating: 5, comment: '' });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not submit review. Are you logged in?');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-16 text-ink/50 text-sm">Loading...</div>;
  if (!service) return <div className="max-w-4xl mx-auto px-6 py-16 text-ink/50 text-sm">Service not found.</div>;

  const [lng, lat] = service.location.coordinates;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white border border-hairline rounded-xl overflow-hidden mb-6">
        {service.photo ? (
          <img src={service.photo} alt={service.name} className="w-full h-56 object-cover" />
        ) : (
          <div className="w-full h-40 bg-route/10 flex items-center justify-center">
            <span className="font-display font-extrabold text-4xl text-route">
              {getInitials(service.name)}
            </span>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-2xl font-extrabold text-ink mb-1">{service.name}</h1>
              <p className="text-sm text-ink/60 flex items-center gap-1.5">
                <Store size={14} /> {service.category}
              </p>
            </div>
            <span className={`text-xs font-medium px-3 py-1.5 rounded-md ${STATUS_STYLES[service.status]}`}>
              {service.status}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-4">
            <Star size={14} className="text-amber fill-amber" />
            <span className="text-sm font-mono text-ink">{service.avgRating || '—'}</span>
            <span className="text-xs text-ink/50">({reviews.length} reviews)</span>
          </div>

          {service.description && (
            <p className="text-sm text-ink/70 mb-4">{service.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-ink/70 mb-5">
            <span className="flex items-center gap-1.5">
              <Phone size={14} className="text-route" /> {service.contact}
            </span>
          </div>

          {isOwner ? (
            <div className="border-t border-hairline pt-4">
              <p className="text-xs font-mono text-route uppercase tracking-wide mb-2">Manage your listing</p>
              <div className="flex items-center gap-2 flex-wrap">
                {['Open', 'Busy', 'Closed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`text-xs font-medium px-3 py-2 rounded-md border transition-colors ${
                      service.status === s
                        ? 'bg-ink text-paper border-ink'
                        : 'border-hairline text-ink/60 hover:border-ink/40'
                    }`}
                  >
                    Set {s}
                  </button>
                ))}
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md border border-clay/30 text-clay hover:bg-clay/5 ml-auto"
                >
                  <Trash2 size={13} /> Delete listing
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-hairline pt-4">
              <button
                onClick={handleReport}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md border border-hairline text-ink/50 hover:border-clay/40 hover:text-clay transition-colors"
              >
                <Flag size={13} /> Report this listing
              </button>
            </div>
          )}
        </div>
      </div>

      {lat !== 0 && lng !== 0 && (
        <div className="rounded-xl overflow-hidden border border-hairline mb-6 h-64">
          <MapContainer center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[lat, lng]}>
              <Popup>{service.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <div className="bg-white border border-hairline rounded-xl p-6">
        <h2 className="text-lg font-bold text-ink mb-4">Reviews</h2>

        {currentUser && (
          <form onSubmit={handleReviewSubmit} className="mb-6 border-b border-hairline pb-6">
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                >
                  <Star
                    size={20}
                    className={n <= reviewForm.rating ? 'text-amber fill-amber' : 'text-hairline'}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
              placeholder="Share your experience..."
              rows={2}
              className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-route resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-amber text-ink text-sm font-medium px-4 py-2 rounded-md hover:bg-amber/90 transition-colors disabled:opacity-60"
            >
              {submitting ? 'Posting...' : 'Post review'}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-ink/50">No reviews yet. Be the first to share your experience.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="border-b border-hairline pb-4 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-ink">{r.user?.name || 'Anonymous'}</span>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber fill-amber" />
                    <span className="text-xs font-mono text-ink">{r.rating}</span>
                  </div>
                </div>
                {r.comment && <p className="text-sm text-ink/70">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}