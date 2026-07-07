import { Link } from 'react-router-dom';
import { Star, MapPin, Users, ShieldCheck } from 'lucide-react';
import { featuredVenues, Venue } from '../../data/venues';
import Button from '../ui/Button';

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className="group rounded-[12px] border border-[#E5E7EB] bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:-translate-y-[2px] transition-all duration-200">
      {/* Image - fixed 200px height */}
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={venue.images[0]}
          alt={venue.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {venue.verified && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E1F5EE] px-2.5 py-1 text-xs font-medium text-[#0F6E56]">
              <ShieldCheck className="h-3 w-3" />
              Verified by Venuewala
            </span>
          </div>
        )}
      </div>

      {/* Content - 16px padding */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
          {venue.name}
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="h-3.5 w-3.5" />
          {venue.area}, {venue.city}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-900">{venue.rating}</span>
            <span className="text-gray-400">({venue.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Users className="h-3.5 w-3.5" />
            {venue.capacity} guests
          </div>
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ₹{venue.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-500"> / day</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={`/booking?venue=${venue.id}`} className="flex-1">
            <Button variant="cta" className="w-full text-sm py-2">
              Book Now
            </Button>
          </Link>
          <Link to={`/venue/${venue.id}`} className="flex-1">
            <Button variant="outline" className="w-full text-sm py-2">
              Site Visit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedSection() {
  return (
    <section className="py-16 bg-cream">
      <div className="container-app">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[22px] font-semibold text-gray-900">
            Top Venues in Delhi NCR
          </h2>
          <Link
            to="/search"
            className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            View All →
          </Link>
        </div>
        <p className="text-sm text-gray-500 mb-6">Most booked venues with excellent ratings</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVenues.slice(0, 6).map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </section>
  );
}
