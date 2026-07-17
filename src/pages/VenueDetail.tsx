import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Star, Users, ShieldCheck, Heart, Share2,
  Utensils, Car, ChevronLeft, ChevronRight,
  Check, Snowflake, Wifi, Speaker, Camera, Plug,
  Sparkles, Copy, Home, Search, ClipboardList,
  ArrowUpDown, Wine,
} from 'lucide-react';
import { Venue, Review, Amenity } from '../data/venues';
import { api, ApiError } from '../lib/api';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const amenityIcons: Record<string, React.ElementType> = {
  AC: Snowflake,
  Parking: Car,
  Generator: Plug,
  WiFi: Wifi,
  Catering: Utensils,
  Decoration: Sparkles,
  'Sound System': Speaker,
  CCTV: Camera,
  'Bridal Room': Heart,
  'Vastu Compliant': Check,
  Lift: ArrowUpDown,
  'Bar Area': Wine,
};

type Slot = 'morning' | 'evening' | 'fullDay';
type FoodOption = 'venueOnly' | 'withCatering';

export default function VenueDetail() {
  const { id } = useParams();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'pricing' | 'reviews' | 'location'>('overview');
  const [mobileImageIndex, setMobileImageIndex] = useState(0);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot>('fullDay');
  const [foodOption, setFoodOption] = useState<FoodOption>('venueOnly');
  const [guestCount, setGuestCount] = useState(100);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    api
      .getVenue(id)
      .then(({ venue, reviews }) => {
        if (cancelled) return;
        setVenue(venue);
        setReviews(reviews);
        setGuestCount(Math.min(100, venue.capacity));
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError && err.status === 404
            ? 'This venue could not be found.'
            : 'Could not load this venue right now. The server might be waking up - try refreshing.'
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const pricing = useMemo(() => {
    if (!venue) return null;
    const slotPricing = venue.pricing[selectedSlot];
    const venueFee = foodOption === 'withCatering' ? slotPricing.withCatering : slotPricing.venueOnly;
    const cateringPerGuest = foodOption === 'withCatering' ? 800 : 0;
    const cateringTotal = foodOption === 'withCatering' ? cateringPerGuest * guestCount : 0;
    const platformFee = Math.round((venueFee + cateringTotal) * 0.05);
    const gstOnPlatform = Math.round(platformFee * 0.18);
    const total = venueFee + cateringTotal + platformFee + gstOnPlatform;
    const advance = Math.round(total * 0.25);
    const balance = total - advance;
    return { venueFee, cateringTotal, cateringPerGuest, platformFee, gstOnPlatform, total, advance, balance };
  }, [venue, selectedSlot, foodOption, guestCount]);

  const slotLabel: Record<Slot, string> = {
    morning: 'Morning (8 AM – 2 PM)',
    evening: 'Evening (4 PM – 11 PM)',
    fullDay: 'Full Day (8 AM – 11 PM)',
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allAmenities = [
    'AC', 'Parking', 'Generator', 'WiFi', 'Catering', 'Decoration',
    'Sound System', 'CCTV', 'Bridal Room', 'Vastu Compliant', 'Lift', 'Bar Area',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 mx-auto mb-3 rounded-full border-2 border-primary-200 border-t-primary-500 animate-spin" />
          <p className="text-sm text-gray-400">Loading venue...</p>
        </div>
      </div>
    );
  }

  if (loadError || !venue || !pricing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-sm text-coral-500 mb-4">{loadError || 'This venue could not be found.'}</p>
          <Link to="/search">
            <Button variant="cta">Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  const starBreakdownTotal = Object.values(venue.starBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container-app py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="flex items-center gap-1 hover:text-primary-500 transition-colors">
              <Home className="h-3.5 w-3.5" />Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            <Link to="/search" className="flex items-center gap-1 hover:text-primary-500 transition-colors">
              <Search className="h-3.5 w-3.5" />Search
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            <span className="text-gray-900 font-medium truncate max-w-[180px]">{venue.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-app pt-5">
        <div className="hidden md:grid grid-cols-5 gap-2 rounded-card overflow-hidden h-[400px]">
          <div
            className="col-span-3 cursor-pointer relative group overflow-hidden"
            onClick={() => openLightbox(0)}
          >
            <img src={venue.images[0]} alt={venue.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-2">
            {[1, 2, 3, 4].map((i) => {
              const imgSrc = venue.images[i] || venue.images[0];
              const isLast = i === 4;
              return (
                <div
                  key={i}
                  className="relative cursor-pointer overflow-hidden group"
                  onClick={() => openLightbox(i)}
                >
                  <img src={imgSrc} alt={`${venue.name} ${i + 1}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {isLast && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-5 w-5 text-white mx-auto mb-1" />
                        <span className="text-white text-xs font-semibold">View All {venue.images.length} Photos</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:hidden relative h-64 rounded-card overflow-hidden">
          <img
            src={venue.images[mobileImageIndex]}
            alt={venue.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {venue.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileImageIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === mobileImageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/60'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setMobileImageIndex((p) => (p > 0 ? p - 1 : venue.images.length - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm p-1.5 rounded-full text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMobileImageIndex((p) => (p < venue.images.length - 1 ? p + 1 : 0))}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm p-1.5 rounded-full text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => openLightbox(mobileImageIndex)}
            className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium"
          >
            {mobileImageIndex + 1} / {venue.images.length}
          </button>
        </div>
      </div>

      <Modal open={lightboxOpen} onClose={() => setLightboxOpen(false)}>
        <div className="relative select-none">
          <img
            src={venue.images[lightboxIndex]}
            alt={`${venue.name} photo ${lightboxIndex + 1}`}
            className="w-full max-h-[70vh] object-contain rounded-input"
          />
          <button
            onClick={() => setLightboxIndex((i) => (i > 0 ? i - 1 : venue.images.length - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white shadow-md transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => setLightboxIndex((i) => (i < venue.images.length - 1 ? i + 1 : 0))}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white shadow-md transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-sm text-gray-500 font-medium">{lightboxIndex + 1} / {venue.images.length}</span>
            <div className="flex gap-1">
              {venue.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === lightboxIndex ? 'w-4 bg-primary-500' : 'w-1.5 bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <div className="container-app py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {venue.verified && (
                      <Badge variant="success"><ShieldCheck className="h-3 w-3" />Verified by Venuewala</Badge>
                    )}
                  </div>
                  <h1 className="text-[28px] font-bold text-gray-900 leading-tight mb-2">{venue.name}</h1>
                  <div className="flex items-center gap-1.5 text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 shrink-0 text-primary-500" />
                    <span className="text-sm">{venue.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.round(venue.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-900">{venue.rating}</span>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="text-sm text-primary-500 hover:underline"
                    >
                      ({venue.reviews} reviews)
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-input border text-sm font-medium transition-colors ${saved ? 'border-coral-200 bg-coral-50 text-coral-500' : 'border-gray-200 text-gray-600 hover:border-coral-200 hover:text-coral-500'}`}
                  >
                    <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-2 rounded-input border border-gray-200 text-sm font-medium text-gray-600 hover:border-primary-200 hover:text-primary-500 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-input border text-sm font-medium transition-colors ${copied ? 'border-primary-200 bg-primary-50 text-primary-500' : 'border-gray-200 text-gray-600 hover:border-primary-200 hover:text-primary-500'}`}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { icon: Users, text: `Up to ${venue.capacity} guests` },
                { icon: Star, text: `₹${venue.price.toLocaleString('en-IN')} / day onwards` },
                { icon: Utensils, text: venue.foodAvailable ? 'Catering Available' : 'No In-house Catering' },
                { icon: Car, text: venue.amenities.includes('Parking') ? 'Parking Available' : 'No Parking' },
              ].map((pill) => (
                <span
                  key={pill.text}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700"
                >
                  <pill.icon className="h-3.5 w-3.5" />
                  {pill.text}
                </span>
              ))}
            </div>

            <div className="border-b border-gray-200 mb-6 flex gap-0 overflow-x-auto">
              {(['overview', 'amenities', 'pricing', 'reviews', 'location'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Venue</h2>
                  <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                    <p>{venue.description}</p>
                    <p>
                      The venue is thoughtfully designed to host a wide range of events — from intimate family gatherings
                      to large-scale celebrations. Our dedicated event coordinators ensure every detail is handled with
                      care, leaving you free to enjoy your special day.
                    </p>
                    <p>
                      With state-of-the-art facilities, ample parking, and a prime location close to major landmarks,
                      {venue.name} remains one of the most sought-after event spaces in {venue.area}. The in-house
                      catering team offers a wide menu of vegetarian and non-vegetarian options tailored to your taste.
                    </p>
                    <p>
                      We pride ourselves on transparency — no hidden charges, real-time availability, and flexible
                      booking options with just 25% advance payment required to lock in your date.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Key Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Air Conditioned Hall',
                      '24hr Power Backup',
                      'Ample Parking Space',
                      'In-house Catering',
                      'Decoration Services',
                      venue.amenities.includes('WiFi') ? 'High-speed WiFi' : 'Bridal Room',
                      'CCTV Surveillance',
                      `Up to ${venue.capacity} Guests`,
                    ].map((h) => (
                      <div key={h} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-primary-600" />
                        </div>
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'amenities' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities & Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allAmenities.map((name) => {
                    const Icon = amenityIcons[name] || Check;
                    const available = venue.amenities.includes(name as Amenity) ||
                      (name === 'Bridal Room' && venue.highlights.some((h) => h.toLowerCase().includes('bridal')));
                    return (
                      <div
                        key={name}
                        className={`flex items-center gap-3 rounded-card border p-3.5 transition-colors ${
                          available
                            ? 'border-primary-100 bg-primary-50'
                            : 'border-gray-100 bg-gray-50'
                        }`}
                      >
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${available ? 'bg-primary-100' : 'bg-gray-100'}`}>
                          <Icon className={`h-4.5 w-4.5 ${available ? 'text-primary-600' : 'text-gray-300'}`} style={{ height: '18px', width: '18px' }} />
                        </div>
                        <span className={`text-sm font-medium ${available ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                          {name}
                        </span>
                        {available && <Check className="h-3.5 w-3.5 text-primary-500 ml-auto shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
                <div className="overflow-x-auto rounded-card border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left p-4 font-semibold text-gray-700">Slot</th>
                        <th className="text-center p-4 font-semibold text-gray-700">Venue Only</th>
                        <th className="text-center p-4 font-semibold text-gray-700">With Catering</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {([
                        ['Morning (8 AM – 2 PM)', venue.pricing.morning],
                        ['Evening (4 PM – 11 PM)', venue.pricing.evening],
                        ['Full Day (8 AM – 11 PM)', venue.pricing.fullDay],
                      ] as const).map(([slot, prices]) => (
                        <tr key={slot} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium text-gray-900">{slot}</td>
                          <td className="p-4 text-center">
                            <span className="text-base font-bold text-gray-900">₹{prices.venueOnly.toLocaleString('en-IN')}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="text-base font-bold text-primary-600">₹{prices.withCatering.toLocaleString('en-IN')}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex items-start gap-2 rounded-input bg-amber-50 border border-amber-200 px-4 py-3">
                  <Star className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Prices vary by date and season. Final price shown at checkout. Catering is billed at ₹800 per guest additionally.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Guest Reviews</h2>
                <div className="rounded-card border border-gray-100 p-5 mb-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="text-center shrink-0">
                      <div className="text-5xl font-bold text-gray-900">{venue.rating}</div>
                      <div className="flex items-center gap-0.5 justify-center mt-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.round(venue.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{venue.reviews} reviews</p>
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      {([5, 4, 3, 2, 1] as const).map((star) => {
                        const count = venue.starBreakdown[star];
                        const pct = starBreakdownTotal > 0 ? Math.round((count / starBreakdownTotal) * 100) : 0;
                        return (
                          <div key={star} className="flex items-center gap-3 text-sm">
                            <span className="w-3 text-right text-gray-600 font-medium">{star}</span>
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-10 text-right text-gray-400 text-xs">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {reviews.length > 0 ? reviews.map((r: Review) => (
                    <div key={r.id} className="rounded-card border border-gray-100 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={r.image} alt={r.name} className="h-10 w-10 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900">{r.name}</h4>
                          <span className="text-xs text-gray-500">{r.event}</span>
                        </div>
                        {r.verified && (
                          <Badge variant="success"><ShieldCheck className="h-3 w-3" />Verified</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">"{r.text}"</p>
                    </div>
                  )) : (
                    <p className="text-center text-gray-400 py-8">No reviews yet for this venue.</p>
                  )}
                </div>

                <Button variant="outline" className="w-full sm:w-auto">
                  <ClipboardList className="h-4 w-4" />Write a Review
                </Button>
              </div>
            )}

            {activeTab === 'location' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
                <div className="rounded-card border border-gray-200 overflow-hidden mb-4">
                  <iframe
                    title="Venue Location"
                    src="https://maps.google.com/maps?q=New+Delhi+India&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-64 border-0"
                    loading="lazy"
                  />
                </div>

                <div className="rounded-card border border-gray-100 p-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Full Address</h3>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                      <span>{venue.address}</span>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(venue.address); }}
                      className="shrink-0 p-1.5 rounded-input border border-gray-200 text-gray-400 hover:text-primary-500 hover:border-primary-200 transition-colors"
                      title="Copy address"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="rounded-card border border-gray-100 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Nearby Landmarks</h3>
                  <ul className="space-y-2.5">
                    {venue.landmarks.map((l) => (
                      <li key={l} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                          <MapPin className="h-3 w-3 text-primary-600" />
                        </div>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-card border border-gray-200 bg-white shadow-md overflow-hidden">
              <div className="bg-primary-500 px-5 py-4">
                <p className="text-primary-100 text-xs font-medium mb-0.5">Starting from</p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold text-white">₹{venue.price.toLocaleString('en-IN')}</span>
                  <span className="text-primary-200 text-sm pb-0.5"> / day</span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={today}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-input border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Time Slot</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['morning', 'evening', 'fullDay'] as Slot[]).map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-1 rounded-input text-xs font-medium border transition-colors ${
                          selectedSlot === slot
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : 'border-gray-200 text-gray-600 hover:border-primary-300'
                        }`}
                      >
                        {slot === 'morning' ? 'Morning' : slot === 'evening' ? 'Evening' : 'Full Day'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{slotLabel[selectedSlot]}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Food Option</label>
                  <div className="flex rounded-input border border-gray-200 overflow-hidden text-xs">
                    <button
                      onClick={() => setFoodOption('venueOnly')}
                      className={`flex-1 py-2.5 font-medium transition-colors ${foodOption === 'venueOnly' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      Venue Only
                    </button>
                    <button
                      onClick={() => setFoodOption('withCatering')}
                      className={`flex-1 py-2.5 font-medium transition-colors ${foodOption === 'withCatering' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      With Catering
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Expected Guests <span className="font-normal text-gray-400">(max {venue.capacity})</span>
                  </label>
                  <div className="flex items-center rounded-input border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setGuestCount((g) => Math.max(10, g - 10))}
                      className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors font-bold text-lg leading-none"
                    >
                      −
                    </button>
                    <div className="flex-1 text-center text-sm font-semibold text-gray-900">{guestCount}</div>
                    <button
                      onClick={() => setGuestCount((g) => Math.min(venue.capacity, g + 10))}
                      className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors font-bold text-lg leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Base price</span>
                    <span className="text-gray-800 font-medium">₹{pricing.venueFee.toLocaleString('en-IN')}</span>
                  </div>
                  {pricing.cateringTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Catering ({guestCount}×₹{pricing.cateringPerGuest})</span>
                      <span className="text-gray-800 font-medium">₹{pricing.cateringTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Platform fee (5%)</span>
                    <span className="text-gray-800 font-medium">₹{pricing.platformFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">GST on fee (18%)</span>
                    <span className="text-gray-800 font-medium">₹{pricing.gstOnPlatform.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold text-base">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{pricing.total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-coral-600 font-semibold">Pay now (25% advance)</span>
                    <span className="text-coral-500 font-bold">₹{pricing.advance.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Balance on event day</span>
                    <span className="text-gray-700 font-medium">₹{pricing.balance.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Link to={`/booking?venue=${venue.id}`}>
                  <Button variant="cta" className="w-full py-3 text-sm">Book Now</Button>
                </Link>
                <Button variant="outline" className="w-full py-3 text-sm">
                  <MapPin className="h-4 w-4" />Schedule a Site Visit
                </Button>

                <p className="text-[11px] text-gray-400 leading-relaxed text-center border-t border-gray-100 pt-3">
                  Free cancellation within 7 days of booking or 3 months before event date, whichever is earlier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}