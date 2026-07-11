import { Navigate, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import About from './pages/About';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Vendors from './pages/Vendors';
import VendorProfile from './pages/VendorProfile';
import Profile from './pages/Profile';
import ServiceDetail from './pages/ServiceDetail';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import RequireAuth from './components/RequireAuth';

function App() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/browse" replace /> : <Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route element={<RequireAuth />}>
            <Route path="/browse" element={<Browse />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendor/:id" element={<VendorProfile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
          </Route>
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
