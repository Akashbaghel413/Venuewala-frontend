import { useState } from 'react';
import {
  BarChart3, Building2, Calendar, IndianRupee, Star, Settings, Bell, LogOut,
  Plus, Pause, PenLine, Trash2, Check, X, ChevronLeft, ChevronRight,
  MessageCircle, Send, Download, TrendingUp, TrendingDown, Wallet,
  CheckCircle, AlertCircle, Upload, Clock,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import {
  ownerVenues, ownerBookings, monthlyBookings, ownerReviews,
  payouts, calendarData, CalendarDay,
} from '../data/dashboard';
import { amenityList, Amenity } from '../data/venues';
import StatusBadge from '../components/dashboard/StatusBadge';
import EmptyState from '../components/dashboard/EmptyState';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

type OwnerTab = 'overview' | 'venues' | 'bookings' | 'calendar' | 'earnings' | 'reviews' | 'settings';

const sidebarItems: { id: OwnerTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'venues', label: 'My Venues', icon: Building2 },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'earnings', label: 'Earnings', icon: IndianRupee },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
];

/* ── Toast helper ── */
function useToast() {
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  return { toast, setToast };
}

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState<OwnerTab>('overview');
  const { toast, setToast } = useToast();

  return (
    <div className="min-h-screen bg-cream pb-16 lg:pb-0">
      {/* Top header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="container-app flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="Profile"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="text-sm font-semibold text-gray-900">Rajesh Verma</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-coral-500" />
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-app py-6">
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-[240px] shrink-0">
            <nav className="sticky top-20 rounded-card bg-white p-2 shadow-sm space-y-0.5">
              {/* Owner info */}
              <div className="px-3 py-3 mb-2 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">Rajesh Verma</p>
                    <p className="text-xs text-gray-400 truncate">rajesh@vermaevents.in</p>
                  </div>
                </div>
              </div>
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-input text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'overview' && <OverviewTab setToast={setToast} />}
            {activeTab === 'venues' && <VenuesTab setToast={setToast} />}
            {activeTab === 'bookings' && <BookingsTab setToast={setToast} />}
            {activeTab === 'calendar' && <CalendarTab />}
            {activeTab === 'earnings' && <EarningsTab setToast={setToast} />}
            {activeTab === 'reviews' && <ReviewsTab />}
            {activeTab === 'settings' && <SettingsTab setToast={setToast} />}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-card border px-4 py-3 shadow-lg ${toast.type === 'success' ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {toast.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Mobile bottom tab bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                activeTab === item.id ? 'text-primary-500' : 'text-gray-400'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label.slice(0, 6)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Overview ── */
function OverviewTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">{greeting}, Rajesh</h2>
      <p className="text-sm text-gray-500 mb-5">Here's what's happening with your venues today.</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Bookings This Month', value: '24', icon: Calendar, color: 'primary', trend: '+12%' },
          { label: 'Revenue This Month', value: '₹3,45,000', icon: IndianRupee, color: 'primary', trend: '+8%' },
          { label: 'Pending Requests', value: '5', icon: Clock, color: 'amber', trend: '' },
          { label: 'Average Rating', value: '4.6', icon: Star, color: 'amber', trend: '' },
        ].map((s) => (
          <div key={s.label} className="rounded-card bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <s.icon className={`h-5 w-5 ${s.color === 'primary' ? 'text-primary-500' : 'text-amber-500'}`} />
              {s.trend && (
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${s.trend.startsWith('+') ? 'text-primary-600' : 'text-red-500'}`}>
                  {s.trend.startsWith('+') ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{s.trend}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-card bg-white p-5 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Bookings — Last 6 Months</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyBookings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#1D9E75" strokeWidth={2.5} dot={{ fill: '#1D9E75', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent requests */}
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Booking Requests</h3>
      <div className="rounded-card bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="p-3">Booking ID</th>
              <th className="p-3">Client</th>
              <th className="p-3">Venue</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ownerBookings.slice(0, 4).map((b) => (
              <tr key={b.id} className="border-b border-gray-50">
                <td className="p-3 font-mono text-xs text-gray-500">{b.id}</td>
                <td className="p-3 font-medium text-gray-900">{b.clientName}</td>
                <td className="p-3 text-gray-500">{b.venueName}</td>
                <td className="p-3 text-gray-500">{b.date}</td>
                <td className="p-3 font-semibold">₹{b.amount.toLocaleString('en-IN')}</td>
                <td className="p-3">
                  {b.status === 'pending' && (
                    <div className="flex gap-1.5">
                      <button className="flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full hover:bg-primary-100 transition-colors" onClick={() => setToast({ type: 'success', message: `Booking ${b.id} accepted` })}>
                        <Check className="h-3 w-3" />Accept
                      </button>
                      <button className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full hover:bg-red-100 transition-colors">
                        <X className="h-3 w-3" />Reject
                      </button>
                    </div>
                  )}
                  {b.status !== 'pending' && <StatusBadge status={b.status} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── My Venues ── */
function VenuesTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [venueName, setVenueName] = useState('');
  const [venueType, setVenueType] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueCapacity, setVenueCapacity] = useState('');
  const [venueDesc, setVenueDesc] = useState('');
  const [venuePincode, setVenuePincode] = useState('');
  const [morningVenue, setMorningVenue] = useState('');
  const [morningCatering, setMorningCatering] = useState('');
  const [eveningVenue, setEveningVenue] = useState('');
  const [eveningCatering, setEveningCatering] = useState('');
  const [fullVenue, setFullVenue] = useState('');
  const [fullCatering, setFullCatering] = useState('');
  const [cateringPerHead, setCateringPerHead] = useState('800');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const toggleAmenity = (a: Amenity) => {
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const validateStep = (step: number) => {
    if (step === 1) return venueName && venueType && venueAddress && venuePincode && venueCapacity && venueDesc;
    if (step === 2) return morningVenue && eveningVenue && fullVenue;
    if (step === 3) return selectedAmenities.length > 0;
    if (step === 4) return uploadedPhotos.length > 0;
    return true;
  };

  const handleNext = () => {
    if (validateStep(addStep)) setAddStep((s) => Math.min(s + 1, 5));
  };

  const handleSubmit = () => {
    setShowAddForm(false);
    setAddStep(1);
    setToast({ type: 'success', message: 'Venue submitted for verification. We will review it within 24 hours.' });
  };

  if (showAddForm) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add New Venue</h2>
          <button onClick={() => { setShowAddForm(false); setAddStep(1); }} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`h-7 w-7 flex items-center justify-center rounded-full text-xs font-semibold transition-colors ${addStep >= s ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {addStep > s ? <Check className="h-3.5 w-3.5" /> : s}
              </div>
              {s < 5 && <div className={`h-0.5 w-6 transition-colors ${addStep > s ? 'bg-primary-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="rounded-card bg-white p-6 shadow-sm">
          {addStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold mb-2">Basic Info</h3>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Venue Name *</label><input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="e.g. Green Valley Farmhouse" className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Type *</label><select value={venueType} onChange={(e) => setVenueType(e.target.value)} className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"><option value="">Select type</option><option>Farmhouse</option><option>Banquet Hall</option><option>Community Centre</option><option>DDA Ground</option><option>Bhavan / Hall</option><option>Mandir</option><option>Dharamshala</option></select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Address *</label><input type="text" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} placeholder="Full address" className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Pincode *</label><input type="text" value={venuePincode} onChange={(e) => setVenuePincode(e.target.value)} placeholder="110075" className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Description *</label><textarea rows={3} value={venueDesc} onChange={(e) => setVenueDesc(e.target.value)} placeholder="Describe your venue..." className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 resize-none" /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Capacity *</label><input type="number" value={venueCapacity} onChange={(e) => setVenueCapacity(e.target.value)} placeholder="500" className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
              <Button variant="primary" onClick={handleNext} disabled={!validateStep(1)}>Next: Pricing</Button>
            </div>
          )}
          {addStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold mb-2">Pricing</h3>
              <table className="w-full text-sm border border-gray-100 rounded-input overflow-hidden">
                <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="p-2 text-left text-gray-500">Slot</th><th className="p-2 text-center text-gray-500">Venue Only (₹)</th><th className="p-2 text-center text-gray-500">With Catering (₹)</th></tr></thead>
                <tbody>
                  {[
                    ['Morning', morningVenue, setMorningVenue, morningCatering, setMorningCatering],
                    ['Evening', eveningVenue, setEveningVenue, eveningCatering, setEveningCatering],
                    ['Full Day', fullVenue, setFullVenue, fullCatering, setFullCatering],
                  ].map(([slot, v, sv, c, sc]) => (
                    <tr key={slot as string} className="border-b border-gray-50">
                      <td className="p-2 font-medium">{slot as string}</td>
                      <td className="p-2"><input type="number" value={v as string} onChange={(e) => (sv as (v: string) => void)(e.target.value)} placeholder="0" className="w-full rounded border border-gray-200 px-2 py-1 text-sm text-center" /></td>
                      <td className="p-2"><input type="number" value={c as string} onChange={(e) => (sc as (v: string) => void)(e.target.value)} placeholder="0" className="w-full rounded border border-gray-200 px-2 py-1 text-sm text-center" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Catering per head (₹)</label><input type="number" value={cateringPerHead} onChange={(e) => setCateringPerHead(e.target.value)} className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm max-w-xs focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
              <div className="flex gap-3"><Button variant="outline" onClick={() => setAddStep(1)}>Back</Button><Button variant="primary" onClick={handleNext} disabled={!validateStep(2)}>Next: Amenities</Button></div>
            </div>
          )}
          {addStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold mb-2">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {amenityList.map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`flex items-center gap-2 rounded-input border px-3 py-2.5 text-sm cursor-pointer transition-colors ${selectedAmenities.includes(a) ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}
                  >
                    <div className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${selectedAmenities.includes(a) ? 'bg-primary-500 border-primary-500' : 'border-gray-300'}`}>
                      {selectedAmenities.includes(a) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    {a}
                  </button>
                ))}
              </div>
              <div className="flex gap-3"><Button variant="outline" onClick={() => setAddStep(2)}>Back</Button><Button variant="primary" onClick={handleNext} disabled={!validateStep(3)}>Next: Photos</Button></div>
            </div>
          )}
          {addStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold mb-2">Photos (up to 10)</h3>
              <div
                className="border-2 border-dashed border-gray-200 rounded-card p-10 text-center hover:border-primary-300 transition-colors cursor-pointer"
                onClick={() => {
                  const urls = ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200', 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=200'];
                  setUploadedPhotos((prev) => [...prev, ...urls].slice(0, 10));
                }}
              >
                <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click to simulate upload</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG — max 5 MB each</p>
              </div>
              {uploadedPhotos.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {uploadedPhotos.map((url, i) => (
                    <div key={i} className="relative rounded-input overflow-hidden h-20">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button onClick={() => setUploadedPhotos((prev) => prev.filter((_, j) => j !== i))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70 transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-3"><Button variant="outline" onClick={() => setAddStep(3)}>Back</Button><Button variant="primary" onClick={handleNext} disabled={!validateStep(4)}>Next: Review</Button></div>
            </div>
          )}
          {addStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold mb-2">Review & Submit</h3>
              <div className="rounded-input bg-gray-50 border border-gray-100 p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{venueName || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium">{venueType || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="font-medium">{venueAddress || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Capacity</span><span className="font-medium">{venueCapacity || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Amenities</span><span className="font-medium">{selectedAmenities.join(', ') || '—'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Photos</span><span className="font-medium">{uploadedPhotos.length} uploaded</span></div>
              </div>
              <div className="flex gap-3"><Button variant="outline" onClick={() => setAddStep(4)}>Back</Button><Button variant="primary" onClick={handleSubmit}>Submit for Verification</Button></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">My Venues</h2>
        <Button variant="primary" className="text-sm" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4" />Add New Venue
        </Button>
      </div>
      {ownerVenues.length === 0 ? (
        <EmptyState message="No venues listed yet." />
      ) : (
        <div className="space-y-3">
          {ownerVenues.map((v) => (
            <div key={v.id} className="rounded-card bg-white p-4 shadow-sm flex gap-4">
              <img src={v.image} alt={v.name} className="h-20 w-28 rounded-input object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{v.name}</h3>
                    <p className="text-xs text-gray-500">{v.type}</p>
                  </div>
                  <StatusBadge status={v.status} />
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>8 bookings this month</span>
                  <span className="text-gray-300">|</span>
                  <span>₹2,45,000 earned</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" className="text-xs py-1 px-3"><PenLine className="h-3 w-3" />Edit</Button>
                  <Button variant="outline" className="text-xs py-1 px-3">{v.status === 'paused' ? <Check className="h-3 w-3" /> : <Pause className="h-3 w-3" />}{v.status === 'paused' ? 'Activate' : 'Pause'}</Button>
                  <Button variant="outline" className="text-xs py-1 px-3 text-red-500 border-red-200 hover:bg-red-50"><Trash2 className="h-3 w-3" />Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Bookings ── */
function BookingsTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [venueFilter, setVenueFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [messageModal, setMessageModal] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [messageText, setMessageText] = useState('');

  const filtered = ownerBookings.filter((b) => {
    const statusMatch = statusFilter === 'all' || b.status === statusFilter;
    const venueMatch = venueFilter === 'all' || b.venueName === venueFilter;
    const dateMatch = (!dateFrom || b.date >= dateFrom) && (!dateTo || b.date <= dateTo);
    return statusMatch && venueMatch && dateMatch;
  });

  const uniqueVenues = [...new Set(ownerBookings.map((b) => b.venueName))];

  const handleAccept = (id: string) => {
    setToast({ type: 'success', message: `Booking ${id} accepted` });
  };

  const handleReject = (id: string) => {
    setRejectModal(null);
    setRejectReason('');
    setToast({ type: 'success', message: `Booking ${id} rejected` });
  };

  const handleExport = () => {
    setToast({ type: 'success', message: 'Bookings exported to CSV' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Bookings</h2>
        <Button variant="outline" className="text-xs py-2 px-3" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" />Export to CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-input border border-gray-200 px-3 py-1.5 text-xs" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-input border border-gray-200 px-3 py-1.5 text-xs" />
        <select value={venueFilter} onChange={(e) => setVenueFilter(e.target.value)} className="rounded-input border border-gray-200 px-3 py-1.5 text-xs">
          <option value="all">All Venues</option>
          {uniqueVenues.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-input border border-gray-200 px-3 py-1.5 text-xs">
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="rounded-card bg-white shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="p-3">Booking ID</th><th className="p-3">Client</th><th className="p-3">Venue</th><th className="p-3">Event</th><th className="p-3">Date</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-gray-50">
                <td className="p-3 font-mono text-xs text-gray-500">{b.id}</td>
                <td className="p-3 font-medium text-gray-900">{b.clientName}</td>
                <td className="p-3 text-gray-500">{b.venueName}</td>
                <td className="p-3 text-gray-500">{b.eventType}</td>
                <td className="p-3 text-gray-500">{b.date}</td>
                <td className="p-3 font-semibold">₹{b.amount.toLocaleString('en-IN')}</td>
                <td className="p-3"><StatusBadge status={b.status} /></td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {b.status === 'pending' && (
                      <>
                        <button className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-full transition-colors" title="Accept" onClick={() => handleAccept(b.id)}>
                          <Check className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-full transition-colors" title="Reject" onClick={() => setRejectModal(b.id)}>
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-full transition-colors" title="Message" onClick={() => setMessageModal(b.id)}>
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message modal */}
      <Modal open={!!messageModal} onClose={() => { setMessageModal(null); setMessageText(''); }} title="Send Message">
        <div className="space-y-3">
          <textarea
            rows={3}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message to the client..."
            className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 resize-none"
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setMessageModal(null); setMessageText(''); }}>Cancel</Button>
            <Button variant="primary" className="flex-1" onClick={() => { setMessageModal(null); setMessageText(''); setToast({ type: 'success', message: 'Message sent' }); }}>
              <Send className="h-3.5 w-3.5" />Send
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject modal */}
      <Modal open={!!rejectModal} onClose={() => { setRejectModal(null); setRejectReason(''); }} title="Reject Booking">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Please provide a reason for rejecting this booking. The client will be notified.</p>
          <textarea
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Venue unavailable, pricing mismatch, etc."
            className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 resize-none"
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setRejectModal(null); setRejectReason(''); }}>Cancel</Button>
            <Button variant="outline" className="flex-1 text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleReject(rejectModal!)}>
              Reject Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ── Calendar ── */
function CalendarTab() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // July 2026
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [slideOpen, setSlideOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getDayStatus = (day: number): CalendarDay | null => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarData.find((c) => c.date === dateStr) || null;
  };

  const today = new Date();
  const isToday = (day: number) => today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const cellColors: Record<string, string> = {
    booked: 'bg-primary-100 text-primary-700 border-primary-300',
    pending: 'bg-amber-100 text-amber-700 border-amber-300',
    cancelled: 'bg-red-50 text-red-400 border-red-200',
  };

  const handleDayClick = (day: number) => {
    const info = getDayStatus(day);
    if (info) {
      setSelectedDay(info);
      setSlideOpen(true);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Calendar</h2>
      <div className="rounded-card bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="h-5 w-5" /></button>
          <h3 className="text-base font-semibold">{monthNames[month]} {year}</h3>
          <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight className="h-5 w-5" /></button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-xs font-medium text-gray-400 py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayInfo = getDayStatus(day);
            const todayClass = isToday(day) ? 'ring-2 ring-primary-500 ring-offset-1' : '';
            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`h-10 flex flex-col items-center justify-center rounded-input text-sm border transition-colors ${
                  dayInfo && cellColors[dayInfo.status]
                    ? `${cellColors[dayInfo.status]} ${todayClass}`
                    : `border-transparent text-gray-600 hover:bg-gray-50 ${todayClass}`
                }`}
              >
                <span className="text-xs font-medium">{day}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-4 mt-4 text-xs">
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-primary-100 border border-primary-300" /> Confirmed</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-amber-100 border border-amber-300" /> Pending</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-white border border-gray-200" /> Available</span>
        </div>
      </div>

      {/* Side panel */}
      {slideOpen && selectedDay && (
        <div className="rounded-card bg-white p-4 shadow-sm mt-4 border-l-4 border-primary-400 animate-in slide-in-from-right">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">{selectedDay.date}</h3>
            <button onClick={() => setSlideOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
          </div>
          {selectedDay.clientName ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">{selectedDay.clientName.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedDay.clientName}</p>
                  <p className="text-xs text-gray-500">{selectedDay.bookingId || 'Booking'}</p>
                </div>
              </div>
              <StatusBadge status={selectedDay.status === 'booked' ? 'confirmed' : selectedDay.status === 'pending' ? 'pending' : 'cancelled'} />
            </div>
          ) : (
            <p className="text-sm text-gray-500">No bookings on this date.</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Earnings ── */
function EarningsTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const totalEarned = 635000;
  const feesDeducted = 31750;
  const netPayout = totalEarned - feesDeducted;
  const pendingPayout = 152500;

  const monthlyEarnings = [
    { month: 'Jan', earnings: 95000 },
    { month: 'Feb', earnings: 120000 },
    { month: 'Mar', earnings: 145000 },
    { month: 'Apr', earnings: 110000 },
    { month: 'May', earnings: 160000 },
    { month: 'Jun', earnings: 185000 },
  ];

  const [payoutModal, setPayoutModal] = useState(false);
  const canRequestPayout = pendingPayout >= 1000;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Earnings</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Earned', value: `₹${(totalEarned / 100000).toFixed(1)}L`, icon: IndianRupee },
          { label: 'Fees Deducted', value: `₹${(feesDeducted / 1000).toFixed(0)}K`, icon: TrendingDown },
          { label: 'Net Received', value: `₹${(netPayout / 100000).toFixed(1)}L`, icon: CheckCircle },
          { label: 'Pending Payout', value: `₹${(pendingPayout / 1000).toFixed(0)}K`, icon: Wallet },
        ].map((s) => (
          <div key={s.label} className="rounded-card bg-white p-4 shadow-sm">
            <s.icon className="h-5 w-5 mb-2 text-primary-500" />
            <div className="text-xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="rounded-card bg-white p-5 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Monthly Earnings — Last 6 Months</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `₹${v / 1000}K`} />
              <Tooltip formatter={(v) => [`₹${(v as number).toLocaleString('en-IN')}`, 'Earnings']} />
              <Bar dataKey="earnings" fill="#1D9E75" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Request payout */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Payout History</h3>
        <Button
          variant="primary"
          className="text-xs py-2 px-3"
          disabled={!canRequestPayout}
          onClick={() => setPayoutModal(true)}
        >
          Request Payout
        </Button>
      </div>
      <div className="rounded-card bg-white shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="p-3">Date</th><th className="p-3">Amount</th><th className="p-3">Account</th><th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className="border-b border-gray-50">
                <td className="p-3 text-gray-500">{p.date}</td>
                <td className="p-3 font-semibold">₹{p.amount.toLocaleString('en-IN')}</td>
                <td className="p-3 text-gray-500">{p.bank}</td>
                <td className="p-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payout modal */}
      <Modal open={payoutModal} onClose={() => setPayoutModal(false)} title="Request Payout">
        <div className="space-y-4">
          <div className="rounded-input bg-primary-50 border border-primary-200 p-3 text-center">
            <p className="text-xs text-primary-600 font-medium">Amount to be transferred</p>
            <p className="text-2xl font-bold text-primary-700 mt-1">₹{pendingPayout.toLocaleString('en-IN')}</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-medium">HDFC Bank</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Account Number</span><span className="font-medium">XXXX4521</span></div>
            <div className="flex justify-between"><span className="text-gray-500">IFSC</span><span className="font-medium">HDFC0004521</span></div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setPayoutModal(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1" onClick={() => { setPayoutModal(false); setToast({ type: 'success', message: 'Payout request submitted. Funds will be transferred within 3-5 business days.' }); }}>
              Confirm Payout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ── Reviews ── */
function ReviewsTab() {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [reviews, setReviews] = useState(ownerReviews);
  const [venueFilter, setVenueFilter] = useState('all');

  const filtered = venueFilter === 'all' ? reviews : reviews.filter((r) => r.venueName === venueFilter);
  const uniqueVenues = [...new Set(reviews.map((r) => r.venueName))];

  const handleReply = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply: replyText } : r)));
    setReplyingTo(null);
    setReplyText('');
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>

      {/* Overall rating */}
      <div className="rounded-card bg-white p-5 shadow-sm mb-5">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{avgRating}</div>
            <div className="flex items-center gap-0.5 justify-center mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 border-l border-gray-100 pl-4">
            <select
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
              className="rounded-input border border-gray-200 px-3 py-1.5 text-xs"
            >
              <option value="all">All Venues</option>
              {uniqueVenues.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No reviews yet." />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-card bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{r.reviewerName}</h4>
                  <p className="text-xs text-gray-500">{r.venueName} — {r.date}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">{r.text}</p>
              {r.reply && (
                <div className="mt-3 rounded-input bg-primary-50 border border-primary-100 p-3">
                  <p className="text-xs text-primary-600 font-medium mb-1">Your reply:</p>
                  <p className="text-sm text-gray-700">{r.reply}</p>
                </div>
              )}
              {!r.reply && replyingTo === r.id && (
                <div className="mt-3 space-y-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 resize-none"
                  />
                  <div className="flex gap-2">
                    <Button variant="primary" className="text-xs py-1.5 px-3" onClick={() => handleReply(r.id)}>Post Reply</Button>
                    <Button variant="outline" className="text-xs py-1.5 px-3" onClick={() => { setReplyingTo(null); setReplyText(''); }}>Cancel</Button>
                  </div>
                </div>
              )}
              {!r.reply && replyingTo !== r.id && (
                <Button variant="outline" className="text-xs py-1 px-3 mt-3" onClick={() => setReplyingTo(r.id)}>
                  <MessageCircle className="h-3 w-3" />Reply
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Settings ── */
function SettingsTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const [notifs, setNotifs] = useState({
    newBookings: true,
    payments: true,
    reviews: true,
    enquiries: true,
  });
  const [profile, setProfile] = useState({
    ownerName: 'Rajesh Verma',
    businessName: 'Verma Event Spaces Pvt. Ltd.',
    gst: '07AAACV1234F1Z5',
    phone: '+91 98765 43210',
    email: 'rajesh@vermaevents.in',
  });
  const [bank, setBank] = useState({
    account: '45211234567',
    ifsc: 'HDFC0004521',
    bankName: 'HDFC Bank',
  });
  const [showBankEdit, setShowBankEdit] = useState(false);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>

      {/* Business profile */}
      <div className="rounded-card bg-white p-5 shadow-sm mb-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Business Profile</h3>
        <div className="space-y-3">
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Owner Name</label><input type="text" value={profile.ownerName} onChange={(e) => setProfile((p) => ({ ...p, ownerName: e.target.value }))} className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Business Name</label><input type="text" value={profile.businessName} onChange={(e) => setProfile((p) => ({ ...p, businessName: e.target.value }))} className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">GST Number</label><input type="text" value={profile.gst} onChange={(e) => setProfile((p) => ({ ...p, gst: e.target.value }))} className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Phone</label><input type="tel" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Email</label><input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
          </div>
        </div>
        <Button variant="primary" className="mt-4 text-xs py-2" onClick={() => setToast({ type: 'success', message: 'Business profile saved' })}>Save Changes</Button>
      </div>

      {/* Bank details */}
      <div className="rounded-card bg-white p-5 shadow-sm mb-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Bank Details</h3>
        {!showBankEdit ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Account Number</span><span className="font-medium font-mono">XXXX{bank.account.slice(-4)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">IFSC Code</span><span className="font-medium">{bank.ifsc}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-medium">{bank.bankName}</span></div>
            <Button variant="secondary" className="mt-3 text-xs py-2" onClick={() => setShowBankEdit(true)}>Update Bank Details</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Account Number</label><input type="text" value={bank.account} onChange={(e) => setBank((b) => ({ ...b, account: e.target.value }))} className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-gray-600 mb-1">IFSC Code</label><input type="text" value={bank.ifsc} onChange={(e) => setBank((b) => ({ ...b, ifsc: e.target.value }))} className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Bank Name</label><input type="text" value={bank.bankName} onChange={(e) => setBank((b) => ({ ...b, bankName: e.target.value }))} className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="text-xs py-2" onClick={() => setShowBankEdit(false)}>Cancel</Button>
              <Button variant="primary" className="text-xs py-2" onClick={() => { setShowBankEdit(false); setToast({ type: 'success', message: 'Bank details updated. Verification required.' }); }}>Save & Verify</Button>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="rounded-card bg-white p-5 shadow-sm mb-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-3">
          {[
            { key: 'newBookings' as const, label: 'New booking requests' },
            { key: 'payments' as const, label: 'Payment alerts' },
            { key: 'reviews' as const, label: 'New reviews' },
            { key: 'enquiries' as const, label: 'Enquiries & messages' },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">{item.label}</span>
              <button
                onClick={() => setNotifs((n) => ({ ...n, [item.key]: !n[item.key] }))}
                className={`relative h-6 w-11 rounded-full transition-colors ${notifs[item.key] ? 'bg-primary-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifs[item.key] ? 'translate-x-5' : ''}`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-card bg-white p-5 shadow-sm mb-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Change Password</h3>
        <div className="space-y-3">
          <input type="password" placeholder="Current password" className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" />
          <input type="password" placeholder="New password" className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" />
        </div>
        <Button variant="secondary" className="mt-3 text-xs py-2" onClick={() => setToast({ type: 'success', message: 'Password updated' })}>Update Password</Button>
      </div>
    </div>
  );
}
