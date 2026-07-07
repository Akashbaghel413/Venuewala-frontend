import { Link } from 'react-router-dom';
import { Home, Search, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Friendly illustration */}
        <div className="mx-auto mb-6 relative">
          <div className="h-32 w-32 mx-auto rounded-full bg-primary-100 flex items-center justify-center">
            <MapPin className="h-14 w-14 text-primary-400" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-sm">
            <span className="text-xs font-medium text-gray-500">404</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Oops! Page not found</h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" className="w-full sm:w-auto py-3 px-6">
              <Home className="h-4 w-4" />Go to Homepage
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="cta" className="w-full sm:w-auto py-3 px-6">
              <Search className="h-4 w-4" />Search Venues
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
