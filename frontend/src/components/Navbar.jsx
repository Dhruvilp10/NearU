import { Link, useNavigate } from 'react-router-dom';
import { MapPin, LogOut, User, Search, Store } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="border-b border-hairline bg-paper sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-ink text-amber rounded-md p-1.5">
            <MapPin size={20} strokeWidth={2.5} />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-ink">
            Near<span className="text-route">U</span>
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6 font-body text-sm">
          {isLoggedIn ? (
            <>
              <Link to="/browse" className="hidden sm:flex items-center gap-1.5 text-ink/70 hover:text-ink transition-colors"><Search size={16} /> Browse</Link>
              <Link to="/vendors" className="hidden sm:flex items-center gap-1.5 text-ink/70 hover:text-ink transition-colors"><Store size={16} /> Vendors</Link>
              <Link to="/profile" className="flex items-center gap-1.5 text-ink/70 hover:text-ink transition-colors">
                <User size={16} />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-ink text-paper px-4 py-2 rounded-md hover:bg-ink/90 transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/about" className="hidden sm:block text-ink/70 hover:text-ink transition-colors">About us</Link>
              <Link to="/contact" className="hidden sm:block text-ink/70 hover:text-ink transition-colors">Contact us</Link>
              <Link to="/login" className="text-ink/70 hover:text-ink transition-colors">Log in</Link>
              <Link to="/signup" className="bg-amber text-ink px-4 py-2 rounded-md font-medium hover:bg-amber/90 transition-colors">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
