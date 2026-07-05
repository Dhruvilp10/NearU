import { useEffect, useState } from 'react';
import { Store, User as UserIcon, Camera } from 'lucide-react';
import API from '../api/axios';

const SERVICE_TYPES = ['Electrician', 'Plumber', 'Laundry', 'Tiffin Service', 'Tutor', 'Salon', 'Other'];

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showUpgradeForm, setShowUpgradeForm] = useState(false);

  const [form, setForm] = useState({ name: '', mobileNumber: '', address: '' });
  const [vendorForm, setVendorForm] = useState({
    serviceType: '', businessName: '', serviceDescription: '', serviceTiming: '', photoUrl: '',
  });
  const [coords, setCoords] = useState({ latitude: null, longitude: null });

 useEffect(() => {
  API.get('/users/me')
    .then((res) => {
      setUser(res.data);
      setForm({
        name: res.data.name,
        mobileNumber: res.data.mobileNumber,
        address: res.data.address,
      });
      if (res.data.isVendor) {
        setVendorForm((f) => ({ ...f, ...res.data.vendorInfo, photoUrl: res.data.photo || '' }));
      }
    })
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, []);

  const updateForm = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const updateVendorForm = (key) => (e) => setVendorForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await API.put('/users/profile', form);
      setUser(res.data.user);
      setMessage('Profile updated.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveVendorInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await API.put('/users/profile', vendorForm);
      setUser(res.data.user);
      setMessage('Service details updated.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not update service details.');
    } finally {
      setSaving(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    });
  };

  const handleUpgrade = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await API.put('/users/upgrade-to-vendor', {
        ...vendorForm,
        longitude: coords.longitude,
        latitude: coords.latitude,
      });
      setUser(res.data.user);
      setShowUpgradeForm(false);
      setMessage('You are now a vendor! Your listing is live.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not upgrade account.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-lg mx-auto px-6 py-16 text-ink/50 text-sm">Loading...</div>;
  if (!user) return <div className="max-w-lg mx-auto px-6 py-16 text-ink/50 text-sm">Please log in to view your profile.</div>;

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-route/10 text-route flex items-center justify-center font-display font-bold text-lg">
          {getInitials(user.name)}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-ink">{user.name}</h1>
          <p className="text-sm text-ink/60 flex items-center gap-1.5">
            {user.isVendor ? <Store size={13} /> : <UserIcon size={13} />}
            {user.isVendor ? 'Vendor account' : 'User account'}
          </p>
        </div>
      </div>

      {message && (
        <p className="text-sm text-route bg-route/10 border border-route/20 rounded-md px-3 py-2 mb-6">
          {message}
        </p>
      )}

      <form onSubmit={handleSaveProfile} className="bg-white border border-hairline rounded-xl p-6 space-y-4 mb-6">
        <p className="text-xs font-mono text-route uppercase tracking-wide">Basic info</p>

        <div>
          <label className="text-sm font-medium text-ink mb-1 block">Full name</label>
          <input value={form.name} onChange={updateForm('name')}
            className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-route" />
        </div>

        <div>
          <label className="text-sm font-medium text-ink mb-1 block">Mobile number</label>
          <input value={form.mobileNumber} onChange={updateForm('mobileNumber')}
            className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-route" />
        </div>

        <div>
          <label className="text-sm font-medium text-ink mb-1 block">Address</label>
          <input value={form.address} onChange={updateForm('address')}
            className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-route" />
        </div>

        <button type="submit" disabled={saving}
          className="bg-ink text-paper text-sm font-medium px-5 py-2.5 rounded-md hover:bg-ink/90 disabled:opacity-60">
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      {user.isVendor && (
        <form onSubmit={handleSaveVendorInfo} className="bg-white border border-hairline rounded-xl p-6 space-y-4 mb-6">
          <p className="text-xs font-mono text-route uppercase tracking-wide">Service details</p>
           
      <div className="flex items-center gap-3">
     <div className="w-16 h-16 rounded-full border border-hairline overflow-hidden bg-paper flex items-center justify-center flex-shrink-0">
    {vendorForm.photoUrl ? (
      <img src={vendorForm.photoUrl} alt="Shop" className="w-full h-full object-cover" />
    ) : (
      <Camera size={18} className="text-ink/30" />
    )}
  </div>

  <input
    type="text"
    value={vendorForm.photoUrl}
    onChange={updateVendorForm('photoUrl')}
    placeholder="Paste image link"
    className="flex-1 text-xs font-mono border border-hairline rounded-md px-3 py-2.5 focus:outline-none focus:border-route" />
</div>

          <div>
            <label className="text-sm font-medium text-ink mb-1 block">Type of service</label>
            <select value={vendorForm.serviceType} onChange={updateVendorForm('serviceType')}
              className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-route">
              {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-ink mb-1 block">Business name</label>
            <input value={vendorForm.businessName} onChange={updateVendorForm('businessName')}
              className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-route" />
          </div>

          <div>
            <label className="text-sm font-medium text-ink mb-1 block">Description</label>
            <textarea value={vendorForm.serviceDescription} onChange={updateVendorForm('serviceDescription')} rows={2}
              className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-route resize-none" />
          </div>

          <div>
            <label className="text-sm font-medium text-ink mb-1 block">Service timing</label>
            <input value={vendorForm.serviceTiming} onChange={updateVendorForm('serviceTiming')}
              className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-route" />
          </div>

          <button type="submit" disabled={saving}
            className="bg-ink text-paper text-sm font-medium px-5 py-2.5 rounded-md hover:bg-ink/90 disabled:opacity-60">
            {saving ? 'Saving...' : 'Update service details'}
          </button>
        </form>
      )}

      {!user.isVendor && !showUpgradeForm && (
        <div className="bg-white border border-dashed border-route/40 rounded-xl p-6 text-center">
          <Store size={22} className="text-route mx-auto mb-2" />
          <p className="text-sm font-medium text-ink mb-1">Have a service to offer?</p>
          <p className="text-xs text-ink/60 mb-4">Upgrade your account to list your service — no new signup needed.</p>
          <button
            onClick={() => setShowUpgradeForm(true)}
            className="bg-amber text-ink text-sm font-medium px-5 py-2.5 rounded-md hover:bg-amber/90"
          >
            Become a vendor
          </button>
        </div>
      )}

      {!user.isVendor && showUpgradeForm && (
        <form onSubmit={handleUpgrade} className="bg-white border border-hairline rounded-xl p-6 space-y-4">
          <p className="text-xs font-mono text-route uppercase tracking-wide">Become a vendor</p>

          <div>
            <label className="text-sm font-medium text-ink mb-1 block">Type of service</label>
            <select required value={vendorForm.serviceType} onChange={updateVendorForm('serviceType')}
              className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-route">
              <option value="">Select a category</option>
              {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-ink mb-1 block">Business name (optional)</label>
            <input value={vendorForm.businessName} onChange={updateVendorForm('businessName')}
              className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-route" />
          </div>

          <div>
            <label className="text-sm font-medium text-ink mb-1 block">Description (optional)</label>
            <textarea value={vendorForm.serviceDescription} onChange={updateVendorForm('serviceDescription')} rows={2}
              className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-route resize-none" />
          </div>

          <div>
            <label className="text-sm font-medium text-ink mb-1 block">Service timing</label>
            <input value={vendorForm.serviceTiming} onChange={updateVendorForm('serviceTiming')}
              placeholder="e.g. 9:00 AM - 6:00 PM"
              className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-route" />
          </div>

          <div>
            <label className="text-sm font-medium text-ink mb-1 block">Photo link (optional)</label>
            <input value={vendorForm.photoUrl} onChange={updateVendorForm('photoUrl')}
              placeholder="Paste image link"
              className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-route" />
          </div>

          <button
            type="button"
            onClick={handleUseLocation}
            className="flex items-center gap-1.5 text-xs font-medium text-route border border-hairline rounded-md px-3 py-2"
          >
            <Camera size={13} /> {coords.latitude ? 'Location set ✓' : 'Use my current location'}
          </button>

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="bg-amber text-ink text-sm font-medium px-5 py-2.5 rounded-md hover:bg-amber/90 disabled:opacity-60">
              {saving ? 'Saving...' : 'Confirm and become a vendor'}    
            </button>
            <button type="button" onClick={() => setShowUpgradeForm(false)}
              className="text-sm text-ink/50 px-3">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}