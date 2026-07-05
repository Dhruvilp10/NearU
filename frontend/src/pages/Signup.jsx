import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LocateFixed, Camera, User, Store } from 'lucide-react';
import API from '../api/axios';

const SERVICE_TYPES = ['Electrician', 'Plumber', 'Laundry', 'Tiffin Service', 'Tutor', 'Salon', 'Other'];

export default function Signup() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('user');
  const [form, setForm] = useState({
    name: '', email: '', password: '', mobileNumber: '', address: '',
    serviceType: '', businessName: '', serviceDescription: '', serviceTiming: '',
  });
  const [photoUrl, setPhotoUrl] = useState('');
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support location access.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          if (data.display_name) {
            setForm((f) => ({ ...f, address: data.display_name }));
          }
        } catch {
          // keep coords even if reverse lookup fails
        }
        setLocating(false);
      },
      () => {
        setError('Could not access your location. You can type your address instead.');
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/signup', {
        ...form,
        accountType,
        photoUrl,
        longitude: coords.longitude,
        latitude: coords.latitude,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Create your account</h1>
      <p className="text-sm text-ink/60 mb-6">Join NearU to discover or list local services.</p>

      <div className="flex gap-2 mb-8 bg-white border border-hairline rounded-lg p-1">
        <button type="button" onClick={() => setAccountType('user')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors ${accountType === 'user' ? 'bg-ink text-paper' : 'text-ink/60'}`}>
          <User size={16} /> Sign up as User
        </button>
        <button type="button" onClick={() => setAccountType('vendor')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors ${accountType === 'vendor' ? 'bg-ink text-paper' : 'text-ink/60'}`}>
          <Store size={16} /> Sign up as Vendor
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {accountType === 'vendor' && (
          <div className="flex justify-center mb-2">
            {!showPhotoInput && !photoUrl && (
              <button type="button" onClick={() => setShowPhotoInput(true)}
                className="w-24 h-24 rounded-full border-2 border-dashed border-hairline flex flex-col items-center justify-center text-ink/40 hover:border-route hover:text-route transition-colors">
                <Camera size={22} />
                <span className="text-[11px] mt-1">Add photo</span>
              </button>
            )}
            {(showPhotoInput || photoUrl) && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full border border-hairline overflow-hidden bg-white flex items-center justify-center">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Shop preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={22} className="text-ink/30" />
                  )}
                </div>
                <input type="text" placeholder="Paste image link" value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="text-xs font-mono border border-hairline rounded-md px-2 py-1.5 w-48 text-center focus:outline-none focus:border-route" />
              </div>
            )}
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-ink mb-1 block">Full name</label>
          <input required value={form.name} onChange={update('name')}
            className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-route" />
        </div>

        <div>
          <label className="text-sm font-medium text-ink mb-1 block">Email</label>
          <input required type="email" value={form.email} onChange={update('email')}
            className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-route" />
        </div>

        <div>
          <label className="text-sm font-medium text-ink mb-1 block">Mobile number</label>
          <input required value={form.mobileNumber} onChange={update('mobileNumber')}
            className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-route" />
        </div>

        <div>
          <label className="text-sm font-medium text-ink mb-1 block">Password</label>
          <input required type="password" value={form.password} onChange={update('password')}
            className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-route" />
        </div>

        <div>
          <label className="text-sm font-medium text-ink mb-1 block">Address</label>
          <div className="flex gap-2">
            <input required value={form.address} onChange={update('address')} placeholder="Area, city"
              className="flex-1 border border-hairline rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-route" />
            <button type="button" onClick={handleUseLocation}
              className="flex items-center gap-1.5 px-3 rounded-md border border-hairline text-route text-xs font-medium hover:bg-route/5 whitespace-nowrap">
              <LocateFixed size={14} />
              {locating ? 'Locating...' : 'Use my location'}
            </button>
          </div>
        </div>

        {accountType === 'vendor' && (
          <div className="pt-2 border-t border-hairline space-y-4">
            <p className="text-xs font-mono text-route uppercase tracking-wide">Vendor details</p>

            <div>
              <label className="text-sm font-medium text-ink mb-1 block">Type of service</label>
              <select required value={form.serviceType} onChange={update('serviceType')}
                className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-route">
                <option value="">Select a category</option>
                {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-ink mb-1 block">Business name (optional)</label>
              <input value={form.businessName} onChange={update('businessName')}
                className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-route" />
            </div>

            <div>
              <label className="text-sm font-medium text-ink mb-1 block">Description (optional)</label>
              <textarea value={form.serviceDescription} onChange={update('serviceDescription')} rows={2}
                className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-route resize-none" />
            </div>

            <div>
              <label className="text-sm font-medium text-ink mb-1 block">Service timing</label>
              <input value={form.serviceTiming} onChange={update('serviceTiming')} placeholder="e.g. 9:00 AM - 6:00 PM"
                className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-route" />
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-clay bg-clay/10 border border-clay/20 rounded-md px-3 py-2">{error}</p>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-amber text-ink font-medium py-3 rounded-md hover:bg-amber/90 transition-colors disabled:opacity-60">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-ink/60 text-center mt-6">
        Already have an account? <Link to="/login" className="text-route font-medium">Log in</Link>
      </p>
    </div>
  );
}