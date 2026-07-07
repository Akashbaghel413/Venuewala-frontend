import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User, MessageCircle } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const [cookieConsent, setCookieConsent] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cookieConsent') === 'true';
    }
    return true;
  });

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setCookieConsent(true);
  };

  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/onboarding');
  const isAuth = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && !isAuth && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isDashboard && !isAuth && <Footer />}

      {/* Mobile bottom navigation */}
      {!isDashboard && !isAuth && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="flex">
            {[
              { path: '/', icon: Home, label: 'Home' },
              { path: '/search', icon: Search, label: 'Search' },
              { path: '/dashboard/user', icon: Calendar, label: 'Bookings' },
              { path: '/dashboard/user', icon: User, label: 'Profile' },
            ].map((item) => (
              <Link
                key={item.path + item.label}
                to={item.path}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                  (item.path === '/' && location.pathname === '/') ||
                  (item.path === '/search' && location.pathname === '/search') ||
                  (item.path.includes('dashboard') && location.pathname.includes('dashboard'))
                    ? 'text-primary-500'
                    : 'text-gray-400'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Floating WhatsApp button */}
      {!isDashboard && !isAuth && (
        <a
          href="https://wa.me/919876543210?text=Hi%20I%20need%20help%20with%20Venuewala"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 md:bottom-6 right-4 z-40 group"
        >
          <div className="relative">
            <div className="absolute -top-8 right-0 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Need help? Chat with us
              <div className="absolute bottom-0 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 transform translate-y-1/2" />
            </div>
            <div className="h-12 w-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </a>
      )}

      {/* Cookie consent banner */}
      {!cookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:bottom-0 p-4">
          <div className="container-app">
            <div className="rounded-card bg-white border border-gray-200 shadow-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-lg">\ud83c\udf6a</span>
                </div>
                <p className="text-sm text-gray-600">
                  We use cookies to improve your experience on Venuewala.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a href="#" className="text-xs text-gray-500 hover:text-gray-700 underline">Learn More</a>
                <button
                  onClick={acceptCookies}
                  className="rounded-input bg-primary-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-600 transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
