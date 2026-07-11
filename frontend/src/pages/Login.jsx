import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import API from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/browse', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <div className="flex items-center gap-2 mb-1">
        <LogIn size={20} className="text-route" />
        <h1 className="text-2xl font-extrabold text-ink">Log in</h1>
      </div>
      <p className="text-sm text-ink/60 mb-8">Welcome back to NearU.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-ink mb-1 block">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={update('email')}
            className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-route"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink mb-1 block">Password</label>
          <input
            required
            type="password"
            value={form.password}
            onChange={update('password')}
            className="w-full border border-hairline rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-route"
          />
        </div>

        {error && (
          <p className="text-sm text-clay bg-clay/10 border border-clay/20 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper font-medium py-3 rounded-md hover:bg-ink/90 transition-colors disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="text-sm text-ink/60 text-center mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-route font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
