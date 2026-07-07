import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { eventTypes } from '../../data/venues';
import Button from '../ui/Button';

export default function HeroSection() {
  const [city, setCity] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({ city: false, eventType: false });
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { city: !city.trim(), eventType: !eventType };
    setErrors(newErrors);
    if (newErrors.city || newErrors.eventType) return;

    const params = new URLSearchParams();
    params.set('city', city.trim());
    params.set('event', eventType);
    if (date) params.set('date', date);
    navigate(`/search?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="relative min-h-[520px] flex items-center overflow-hidden">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1464146072230-91cabc968266?w=1600"
          alt="Venue background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60" />
      </div>

      <div className="relative container-app py-16 md:py-20 w-full">
        <div className="max-w-3xl">
          <h1 className="text-[42px] md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Book Your Perfect Venue in Delhi NCR
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl">
            Farmhouses, Banquets, Community Halls, Mandirs & more — all at the best prices with instant booking confirmation.
          </p>

          {/* Search box - white card floating over hero */}
          <form onSubmit={handleSearch} className="bg-white rounded-[12px] p-4 md:p-6 shadow-2xl max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {/* City input */}
              <div>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setErrors((prev) => ({ ...prev, city: false })); }}
                  placeholder="City / Pincode *"
                  className={`w-full rounded-[8px] border ${errors.city ? 'border-coral-500 bg-coral-50' : 'border-gray-200 bg-gray-50'} px-4 py-3 text-sm focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors`}
                />
                {errors.city && <p className="text-xs text-coral-500 mt-1">Required</p>}
              </div>

              {/* Event type select */}
              <div>
                <select
                  value={eventType}
                  onChange={(e) => { setEventType(e.target.value); setErrors((prev) => ({ ...prev, eventType: false })); }}
                  className={`w-full rounded-[8px] border ${errors.eventType ? 'border-coral-500 bg-coral-50' : 'border-gray-200 bg-gray-50'} px-4 py-3 text-sm text-gray-700 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors appearance-none`}
                >
                  <option value="">Event Type *</option>
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.eventType && <p className="text-xs text-coral-500 mt-1">Required</p>}
              </div>

              {/* Date input */}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                placeholder="Select Date"
                className="w-full rounded-[8px] border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
              />
            </div>

            {/* Search button - full width on mobile */}
            <Button variant="cta" type="submit" className="w-full md:w-auto text-base px-8 py-3">
              <Search className="h-5 w-5" />
              Search Venues
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
