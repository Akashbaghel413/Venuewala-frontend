import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Globe, MapPin, Bell, Calendar, IndianRupee, Eye, Star } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const notifications = [
  { id: 'N-1', type: 'booking', text: 'Booking confirmed at Shree Ram Banquet', time: '2 min ago', read: false },
  { id: 'N-2', type: 'payment', text: 'Payment received: \u20b938,125', time: '1 hour ago', read: false },
  { id: 'N-3', type: 'visit', text: 'Site visit reminder: Green Valley Farmhouse tomorrow at 11 AM', time: '3 hours ago', read: true },
  { id: 'N-4', type: 'review', text: 'New 5-star review from Priya Singh', time: '1 day ago', read: true },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const [lang, setLang] = useState('EN');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isLoggedIn = !!user;
  const dashboardPath =
    user?.role === 'owner' ? '/dashboard/owner' : user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user';
  const unreadCount = notifs.filter((n) => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?city=${encodeURIComponent(search.trim())}`);
    setMobileSearchOpen(false);
  };

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Venue<span className="text-coral-500">wala</span>
            </span>
          </Link>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by city or pincode..."
                className="w-full rounded-[8px] border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
              />
            </div>
          </form>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Globe className="h-3 w-3" />
              {lang}
            </button>

            {/* Notifications (for logged in users) */}
            {isLoggedIn && (
              <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-coral-500" />}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-[12px] bg-white shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-900">Notifications</span>
                      {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-primary-500 hover:text-primary-600 font-medium">Mark all read</button>}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {notifs.map((n) => (
                        <div key={n.id} className={`p-3 flex gap-3 ${n.read ? 'opacity-60' : ''}`}>
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${n.type === 'booking' ? 'bg-primary-50 text-primary-500' : n.type === 'payment' ? 'bg-amber-50 text-amber-500' : n.type === 'visit' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                            {n.type === 'booking' && <Calendar className="h-4 w-4" />}
                            {n.type === 'payment' && <IndianRupee className="h-4 w-4" />}
                            {n.type === 'visit' && <Eye className="h-4 w-4" />}
                            {n.type === 'review' && <Star className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700">{n.text}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                          </div>
                          {!n.read && <div className="h-2 w-2 rounded-full bg-primary-500 shrink-0 mt-2" />}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-100">
                      <Link to="/dashboard/user" onClick={() => setNotifOpen(false)} className="block text-center text-xs text-primary-500 font-medium hover:text-primary-600">View all notifications</Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link to={dashboardPath} className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-gray-50 transition-colors">
                  {user?.photo ? (
                    <img src={user.photo} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-semibold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={async () => { await logout(); navigate('/'); }}
                  className="text-sm font-medium text-gray-500 hover:text-coral-500 transition-colors px-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="text-sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="cta" className="text-sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

        {/* Mobile buttons */}
        <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="p-2 text-gray-600 hover:text-gray-900">
              <Search className="h-5 w-5" />
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-600 hover:text-gray-900">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar (below logo row) */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by city or pincode..." className="w-full rounded-[8px] border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm" />
              </div>
              <Button variant="cta" type="submit">Search</Button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container-app py-4 space-y-3">
            <button onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')} className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600">
              <Globe className="h-4 w-4" />{lang === 'EN' ? 'English' : 'Hindi'}
            </button>
            <div className="flex gap-2 pt-2">
              {isLoggedIn ? (
                <>
                  <Link to={dashboardPath} className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full text-sm">My Dashboard</Button>
                  </Link>
                  <button
                    onClick={async () => { await logout(); setMobileOpen(false); navigate('/'); }}
                    className="flex-1 rounded-[8px] border-2 border-coral-500 text-coral-500 text-sm font-semibold py-3"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full text-sm">Login</Button></Link>
                  <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}><Button variant="cta" className="w-full text-sm">Sign Up</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
