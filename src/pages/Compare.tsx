import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MapPin, Star, Users, ShieldCheck, Check, X as XIcon,
  Plus, ArrowRight, Trash2,
} from 'lucide-react';
import { featuredVenues, amenityList, Amenity } from '../data/venues';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function Compare() {
  const [searchParams] = useSearchParams();
  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const [selectedVenues, setSelectedVenues] = useState<string[]>(() => {
    const valid = ids.map((id) => featuredVenues.find((v) => v.id === id)?.id).filter(Boolean) as string[];
    return valid.length > 0 ? valid : featuredVenues.slice(0, 2).map((v) => v.id);
  });
  const [addingVenue, setAddingVenue] = useState(false);

  const venues = selectedVenues
    .map((id) => featuredVenues.find((v) => v.id === id))
    .filter(Boolean) as typeof featuredVenues;

  const addable = featuredVenues.filter((v) => !selectedVenues.includes(v.id));

  const removeVenue = (id: string) => {
    setSelectedVenues((prev) => prev.filter((x) => x !== id));
  };

  const addVenue = (id: string) => {
    if (selectedVenues.length < 3) {
      setSelectedVenues((prev) => [...prev, id]);
      setAddingVenue(false);
    }
  };

  const allAmenities = amenityList;

  const comparisonRows: { label: string; render: (v: typeof venues[0]) => React.ReactNode }[] = [
    { label: 'Price / Day', render: (v) => <span className="text-lg font-bold text-gray-900">\u20b9{v.price.toLocaleString('en-IN')}</span> },
    { label: 'Capacity', render: (v) => <span className="flex items-center justify-center gap-1 text-gray-700"><Users className="h-4 w-4 text-gray-400" />{v.capacity} guests</span> },
    { label: 'Rating', render: (v) => <span className="flex items-center justify-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span className="font-semibold">{v.rating}</span><span className="text-gray-400 text-xs">({v.reviews})</span></span> },
    { label: 'Location', render: (v) => <span className="flex items-center justify-center gap-1 text-gray-500 text-xs"><MapPin className="h-3 w-3" />{v.area}, {v.city}</span> },
    ...allAmenities.map((a) => ({
      label: a,
      render: (v: typeof venues[0]) => v.amenities.includes(a as Amenity) ? <Check className="h-5 w-5 text-primary-500 mx-auto" /> : <XIcon className="h-5 w-5 text-red-300 mx-auto" />,
    })),
    { label: 'Morning (Venue Only)', render: (v) => `\u20b9${v.pricing.morning.venueOnly.toLocaleString('en-IN')}` },
    { label: 'Morning (With Catering)', render: (v) => `\u20b9${v.pricing.morning.withCatering.toLocaleString('en-IN')}` },
    { label: 'Evening (Venue Only)', render: (v) => `\u20b9${v.pricing.evening.venueOnly.toLocaleString('en-IN')}` },
    { label: 'Evening (With Catering)', render: (v) => `\u20b9${v.pricing.evening.withCatering.toLocaleString('en-IN')}` },
    { label: 'Full Day (Venue Only)', render: (v) => `\u20b9${v.pricing.fullDay.venueOnly.toLocaleString('en-IN')}` },
    { label: 'Full Day (With Catering)', render: (v) => `\u20b9${v.pricing.fullDay.withCatering.toLocaleString('en-IN')}` },
    { label: 'Cancellation Policy', render: (_v) => <span className="text-xs text-gray-500">Free within 7 days or 3 months before event</span> },
  ];

  return (
    <div className="min-h-screen bg-cream pb-8">
      <div className="container-app py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Compare Venues</h1>

        {venues.length === 0 ? (
          <div className="rounded-card bg-white p-12 text-center shadow-sm">
            <p className="text-gray-500 mb-4">No venues selected for comparison.</p>
            <Link to="/search"><Button variant="primary">Browse Venues</Button></Link>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="min-w-[640px]">
              {/* Sticky header with venue photos + names */}
              <div className="sticky top-0 z-10 bg-cream pb-2">
                <div className="grid gap-4" style={{ gridTemplateColumns: `180px repeat(${venues.length + (venues.length < 3 ? 1 : 0)}, 1fr)` }}>
                  <div /> {/* Empty corner */}
                  {venues.map((v) => (
                    <div key={v.id} className="rounded-card bg-white p-4 shadow-sm text-center relative group">
                      <button onClick={() => removeVenue(v.id)} className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <img src={v.images[0]} alt={v.name} className="h-32 w-full object-cover rounded-input mb-3" />
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{v.name}</h3>
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-2"><MapPin className="h-3.5 w-3.5" />{v.area}, {v.city}</div>
                      {v.verified && <Badge variant="success"><ShieldCheck className="h-3 w-3" />Verified</Badge>}
                    </div>
                  ))}
                  {venues.length < 3 && (
                    <div className="rounded-card border-2 border-dashed border-gray-200 p-4 flex flex-col items-center justify-center min-h-[200px]">
                      {addingVenue ? (
                        <div className="w-full space-y-2 max-h-48 overflow-y-auto">
                          {addable.map((v) => (
                            <button key={v.id} onClick={() => addVenue(v.id)} className="w-full flex items-center gap-2 rounded-input border border-gray-200 p-2 text-left hover:border-primary-300 hover:bg-primary-50 transition-colors">
                              <img src={v.images[0]} alt={v.name} className="h-8 w-12 rounded object-cover" />
                              <div className="flex-1 min-w-0"><p className="text-xs font-medium text-gray-900 truncate">{v.name}</p><p className="text-[10px] text-gray-500">{v.area}</p></div>
                            </button>
                          ))}
                          <button onClick={() => setAddingVenue(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setAddingVenue(true)} className="flex flex-col items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors">
                          <Plus className="h-8 w-8" /><span className="text-sm font-medium">Add Venue</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Comparison rows */}
              <div className="mt-4 rounded-card bg-white shadow-sm overflow-hidden">
                {comparisonRows.map((row, idx) => (
                  <div key={row.label} className={`grid gap-4 items-center ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`} style={{ gridTemplateColumns: `180px repeat(${venues.length + (venues.length < 3 ? 1 : 0)}, 1fr)` }}>
                    <div className="p-3 text-sm font-medium text-gray-600 border-r border-gray-100">{row.label}</div>
                    {venues.map((v) => (
                      <div key={v.id} className="p-3 text-center text-sm text-gray-700">{row.render(v)}</div>
                    ))}
                    {venues.length < 3 && <div className="p-3" />}
                  </div>
                ))}

                {/* Book row */}
                <div className="grid gap-4 items-center border-t border-gray-100" style={{ gridTemplateColumns: `180px repeat(${venues.length + (venues.length < 3 ? 1 : 0)}, 1fr)` }}>
                  <div className="p-3" />
                  {venues.map((v) => (
                    <div key={v.id} className="p-3 text-center">
                      <Link to={`/booking?venue=${v.id}`}><Button variant="cta" className="w-full text-sm py-2.5">Book This Venue <ArrowRight className="h-3.5 w-3.5" /></Button></Link>
                    </div>
                  ))}
                  {venues.length < 3 && <div className="p-3" />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
