import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Heart, Eye, Star, Wallet, Settings,
  Download, X, PenLine, Bell, LogOut, MapPin, Users,
  Copy, MessageCircle, Trash2,
  Phone, CheckCircle, AlertCircle,
  Navigation, Search, Clock, Upload,
} from 'lucide-react';
import {
  userBookings, savedVenues, siteVisits, myReviews,
  walletTransactions,
} from '../data/dashboard';
import StatusBadge from '../components/dashboard/StatusBadge';
import EmptyState from '../components/dashboard/EmptyState';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

type UserTab = 'bookings' | 'saved' | 'visits' | 'reviews' | 'wallet' | 'settings';

const sidebarItems: { id: UserTab; label: string; icon: React.ElementType }[] = [
  { id: 'bookings', label: 'My Bookings', icon: Calendar },
  { id: 'saved', label: 'Saved Venues', icon: Heart },
  { id: 'visits', label: 'Site Visits', icon: Eye },
  { id: 'reviews', label: 'My Reviews', icon: Star },
  { id: 'wallet', label: 'Wallet & Credits', icon: Wallet },
  { id: 'settings', label: 'Account Settings', icon: Settings },
];

/* ── Toast helper ── */
function useToast() {
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);
  return { toast, setToast };
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<UserTab>('bookings');
  const { toast, setToast } = useToast();

  return (
    <div className="min-h-screen bg-cream pb-16 lg:pb-0">
      {/* Top header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="container-app flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="Profile"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="text-sm font-semibold text-gray-900">Priya Sharma</span>
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
          {/* Desktop sidebar — 240px */}
          <aside className="hidden lg:block w-[240px] shrink-0">
            <nav className="sticky top-20 rounded-card bg-white p-2 shadow-sm space-y-0.5">
              {/* User info */}
              <div className="px-3 py-3 mb-2 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">Priya Sharma</p>
                    <p className="text-xs text-gray-400 truncate">priya.sharma@gmail.com</p>
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
            {activeTab === 'bookings' && <BookingsTab setToast={setToast} />}
            {activeTab === 'saved' && <SavedTab setToast={setToast} />}
            {activeTab === 'visits' && <VisitsTab />}
            {activeTab === 'reviews' && <ReviewsTab setToast={setToast} />}
            {activeTab === 'wallet' && <WalletTab setToast={setToast} />}
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
              {item.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Bookings ── */
function BookingsTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const [bookingFilter, setBookingFilter] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [cancelModal, setCancelModal] = useState<string | null>(null);

  const filtered = userBookings.filter((b) => {
    if (bookingFilter === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
    return b.status === bookingFilter;
  });

  const handleCancel = (_id: string) => {
    setCancelModal(null);
    setToast({ type: 'success', message: 'Booking cancelled successfully. Refund will be processed in 5-7 business days.' });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">My Bookings</h2>
      <div className="flex gap-2 mb-5">
        {(['upcoming', 'completed', 'cancelled'] as const).map((f) => {
          const count = userBookings.filter((b) => {
            if (f === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
            return b.status === f;
          }).length;
          return (
            <button
              key={f}
              onClick={() => setBookingFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                bookingFilter === f ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={`No ${bookingFilter} bookings found.`} />
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div key={b.id} className="rounded-card bg-white p-4 shadow-sm flex gap-4">
              <img src={b.venueImage} alt={b.venueName} className="h-20 w-20 rounded-input object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{b.venueName}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <MapPin className="h-3 w-3" />{b.venueArea}
                    </div>
                  </div>
                  <StatusBadge status={b.status as 'confirmed' | 'pending' | 'completed' | 'cancelled'} />
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{b.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.slot}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{b.guests} guests</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                  <span className="text-gray-500">Event:</span> Wedding
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-gray-500">Paid: <span className="font-semibold text-gray-900">₹{b.amountPaid.toLocaleString('en-IN')}</span></span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">Balance: <span className="font-semibold text-coral-500">₹{b.balanceDue.toLocaleString('en-IN')}</span></span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" className="text-xs py-1.5 px-3">
                    <Download className="h-3 w-3" />Download Receipt
                  </Button>
                  {b.canCancel && (
                    <Button variant="outline" className="text-xs py-1.5 px-3 text-red-500 border-red-200 hover:bg-red-50" onClick={() => setCancelModal(b.id)}>
                      <X className="h-3 w-3" />Cancel Booking
                    </Button>
                  )}
                  {b.canReview && (
                    <Button variant="outline" className="text-xs py-1.5 px-3">
                      <PenLine className="h-3 w-3" />Write Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!cancelModal} onClose={() => setCancelModal(null)} title="Cancel Booking">
        <div className="space-y-4">
          <div className="rounded-input bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Free cancellation within 7 days of booking or 3 months before the event date, whichever is earlier.
              After the free window, 50% of the advance payment will be forfeited.
            </p>
          </div>
          <p className="text-sm text-gray-600">Are you sure you want to cancel this booking? This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setCancelModal(null)}>Keep Booking</Button>
            <Button variant="outline" className="flex-1 text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleCancel(cancelModal!)}>Yes, Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ── Saved Venues ── */
function SavedTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const [venues, setVenues] = useState(savedVenues);
  const [, setRemoving] = useState<string | null>(null);

  if (venues.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Saved Venues</h2>
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-card bg-white shadow-sm">
          <Heart className="h-12 w-12 text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm mb-1">No saved venues yet.</p>
          <p className="text-gray-400 text-xs">Browse and save venues you love by clicking the heart icon.</p>
          <Link to="/search" className="mt-4">
            <Button variant="primary" className="text-xs py-2 px-4">
              <Search className="h-3.5 w-3.5" />Browse Venues
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Saved Venues ({venues.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {venues.map((v) => (
          <div key={v.id} className="rounded-card bg-white shadow-sm overflow-hidden group">
            <div className="relative h-40 overflow-hidden">
              <img src={v.image} alt={v.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <button
                onClick={() => {
                  setRemoving(v.id);
                  setTimeout(() => {
                    setVenues((prev) => prev.filter((x) => x.id !== v.id));
                    setRemoving(null);
                    setToast({ type: 'success', message: `${v.name} removed from saved venues` });
                  }, 300);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
              >
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900">{v.name}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <MapPin className="h-3 w-3" />{v.area}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="font-semibold text-gray-900">₹{v.price.toLocaleString('en-IN')}/day</span>
                <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{v.rating}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Link to={`/venue/${v.id}`} className="flex-1">
                  <Button variant="primary" className="w-full text-xs py-2">Book Now</Button>
                </Link>
                <Button
                  variant="outline"
                  className="text-xs py-2 px-3 text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    setVenues((prev) => prev.filter((x) => x.id !== v.id));
                    setToast({ type: 'success', message: `${v.name} removed from saved venues` });
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Site Visits ── */
function VisitsTab() {
  const upcoming = siteVisits.filter((v) => v.status === 'scheduled');
  const past = siteVisits.filter((v) => v.status !== 'scheduled');

  if (siteVisits.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Site Visits</h2>
        <EmptyState message="No site visits scheduled yet." />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Site Visits</h2>
      {upcoming.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Upcoming</h3>
          <div className="space-y-3">
            {upcoming.map((v) => (
              <div key={v.id} className="rounded-card bg-white p-4 shadow-sm flex gap-4 items-start">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <Eye className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{v.venueName}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{v.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{v.time}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />Chattarpur, New Delhi
                      </div>
                    </div>
                    <StatusBadge status="pending" />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" className="text-xs py-1.5 px-3">
                      <Navigation className="h-3 w-3" />Get Directions
                    </Button>
                    <Button variant="outline" className="text-xs py-1.5 px-3 text-red-500 border-red-200 hover:bg-red-50">
                      <X className="h-3 w-3" />Cancel Visit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Past</h3>
          <div className="space-y-3">
            {past.map((v) => (
              <div key={v.id} className="rounded-card bg-white p-4 shadow-sm flex gap-4 items-start opacity-70">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Eye className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{v.venueName}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{v.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{v.time}</span>
                      </div>
                    </div>
                    <StatusBadge status={v.status as 'completed' | 'cancelled'} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── My Reviews ── */
function ReviewsTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const [reviews, setReviews] = useState(myReviews);
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  if (reviews.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Reviews</h2>
        <EmptyState message="You haven't reviewed any venues yet." />
      </div>
    );
  }

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setToast({ type: 'success', message: 'Review deleted successfully' });
  };

  const handleSaveEdit = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, text: editText } : r)));
    setEditing(null);
    setToast({ type: 'success', message: 'Review updated successfully' });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">My Reviews</h2>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-card bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{r.venueName}</h4>
                  <div className="text-xs text-gray-400">{r.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
            </div>
            {editing === r.id ? (
              <div className="space-y-2 mt-2">
                <textarea
                  rows={3}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 resize-none"
                />
                <div className="flex gap-2">
                  <Button variant="primary" className="text-xs py-1.5 px-3" onClick={() => handleSaveEdit(r.id)}>Save</Button>
                  <Button variant="outline" className="text-xs py-1.5 px-3" onClick={() => setEditing(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mt-1">"{r.text}"</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" className="text-xs py-1.5 px-3" onClick={() => { setEditing(r.id); setEditText(r.text); }}>
                    <PenLine className="h-3 w-3" />Edit
                  </Button>
                  <Button variant="outline" className="text-xs py-1.5 px-3 text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="h-3 w-3" />Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Wallet & Credits ── */
function WalletTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const balance = walletTransactions.reduce((acc, t) => acc + (t.type === 'credit' ? t.amount : -t.amount), 0);
  const referralCode = 'PRIYA2026';
  const referrals = { total: 12, converted: 5 };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Wallet & Credits</h2>

      {/* Balance card */}
      <div className="rounded-card bg-primary-500 p-6 mb-6 text-white">
        <p className="text-sm text-primary-100 font-medium">Available Credits</p>
        <p className="text-4xl font-bold mt-1">₹{balance.toLocaleString('en-IN')}</p>
        <p className="text-xs text-primary-200 mt-1">Use credits towards your next booking</p>
      </div>

      {/* How to earn */}
      <div className="rounded-card bg-white p-5 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">How to Earn Credits</h3>
        <div className="space-y-2.5">
          {[
            { amount: '₹500', text: 'per friend who books using your referral code' },
            { amount: '₹100', text: 'for writing a review after your event' },
            { amount: '₹200', text: 'for completing your profile' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 text-sm">
              <span className="text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded text-xs">{item.amount}</span>
              <span className="text-gray-600">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Referral section */}
      <div className="rounded-card bg-white p-5 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Refer & Earn</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 rounded-input border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono text-gray-700">
            {referralCode}
          </div>
          <Button
            variant="outline"
            className="text-xs py-2 px-3"
            onClick={() => {
              navigator.clipboard.writeText(referralCode);
              setToast({ type: 'success', message: 'Referral code copied!' });
            }}
          >
            <Copy className="h-3 w-3" />Copy
          </Button>
        </div>
        <div className="flex gap-2 mb-4">
          <Button variant="primary" className="text-xs py-2 px-3 flex-1">
            <MessageCircle className="h-3 w-3" />Share on WhatsApp
          </Button>
          <Button variant="outline" className="text-xs py-2 px-3 flex-1">
            <Phone className="h-3 w-3" />Share via SMS
          </Button>
        </div>
        <div className="flex gap-4 text-center border-t border-gray-100 pt-3">
          <div className="flex-1">
            <p className="text-lg font-bold text-gray-900">{referrals.total}</p>
            <p className="text-xs text-gray-500">Friends Referred</p>
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-primary-600">{referrals.converted}</p>
            <p className="text-xs text-gray-500">Converted</p>
          </div>
        </div>
      </div>

      {/* Transaction table */}
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Transaction History</h3>
      <div className="rounded-card bg-white shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="p-3">Date</th>
              <th className="p-3">Description</th>
              <th className="p-3 text-right">Debit</th>
              <th className="p-3 text-right">Credit</th>
              <th className="p-3 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              let running = 0;
              return [...walletTransactions].reverse().map((t) => {
                running += t.type === 'credit' ? t.amount : -t.amount;
                return (
                  <tr key={t.id} className="border-b border-gray-50">
                    <td className="p-3 text-gray-500">{t.date}</td>
                    <td className="p-3 text-gray-700">{t.description}</td>
                    <td className="p-3 text-right font-semibold text-coral-500">{t.type === 'debit' ? `₹${t.amount.toLocaleString('en-IN')}` : '—'}</td>
                    <td className="p-3 text-right font-semibold text-primary-600">{t.type === 'credit' ? `+₹${t.amount.toLocaleString('en-IN')}` : '—'}</td>
                    <td className="p-3 text-right font-semibold text-gray-900">₹{running.toLocaleString('en-IN')}</td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Settings ── */
function SettingsTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const [notifs, setNotifs] = useState({
    bookings: true,
    payments: true,
    offers: false,
    visits: true,
  });
  const [profile, setProfile] = useState({
    name: 'Priya Sharma',
    phone: '9876543210',
    email: 'priya.sharma@gmail.com',
    city: 'New Delhi',
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [pwStrength, setPwStrength] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const checkStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    setPwStrength(s);
  };

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-amber-400', 'bg-primary-400', 'bg-primary-500'];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>

      {/* Profile */}
      <div className="rounded-card bg-white p-5 shadow-sm mb-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile</h3>
        <div className="flex items-center gap-4 mb-5">
          <div className="relative group cursor-pointer">
            <img
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover"
            />
            <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="h-4 w-4 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Change Photo</p>
            <p className="text-xs text-gray-400">Click to upload a new profile picture</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
              className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-colors"
            />
          </div>
        </div>
        <Button variant="primary" className="mt-4 text-xs py-2" onClick={() => setToast({ type: 'success', message: 'Profile saved successfully' })}>
          Save Changes
        </Button>
      </div>

      {/* Notifications */}
      <div className="rounded-card bg-white p-5 shadow-sm mb-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-3">
          {[
            { key: 'bookings' as const, label: 'Booking confirmations', desc: 'Get notified when your booking is confirmed or updated' },
            { key: 'payments' as const, label: 'Payment alerts', desc: 'Receive alerts for successful payments and refunds' },
            { key: 'offers' as const, label: 'Offers & promotions', desc: 'Stay updated with exclusive deals and seasonal discounts' },
            { key: 'visits' as const, label: 'Site visit reminders', desc: 'Get reminders before your scheduled site visits' },
          ].map((item) => (
            <label key={item.key} className="flex items-start justify-between cursor-pointer gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-medium">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifs((n) => ({ ...n, [item.key]: !n[item.key] }))}
                className={`relative h-6 w-11 rounded-full transition-colors shrink-0 mt-0.5 ${notifs[item.key] ? 'bg-primary-500' : 'bg-gray-300'}`}
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
          <input
            type="password"
            placeholder="Current password"
            value={passwords.current}
            onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          />
          <div>
            <input
              type="password"
              placeholder="New password"
              value={passwords.new}
              onChange={(e) => { setPasswords((p) => ({ ...p, new: e.target.value })); checkStrength(e.target.value); }}
              className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            />
            {passwords.new && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i < pwStrength ? strengthColors[Math.min(pwStrength - 1, 4)] : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-500">{strengthLabels[pwStrength]}</p>
              </div>
            )}
          </div>
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwords.confirm}
            onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          />
          {passwords.new && passwords.confirm && passwords.new !== passwords.confirm && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}
        </div>
        <Button variant="secondary" className="mt-3 text-xs py-2" onClick={() => {
          if (passwords.new !== passwords.confirm) return;
          setToast({ type: 'success', message: 'Password updated successfully' });
          setPasswords({ current: '', new: '', confirm: '' });
          setPwStrength(0);
        }}>
          Update Password
        </Button>
      </div>

      {/* Danger zone */}
      <div className="rounded-card border border-red-200 bg-red-50 p-5 mb-5">
        <h3 className="text-sm font-semibold text-red-700 mb-2">Danger Zone</h3>
        <p className="text-xs text-red-600 mb-3">Deleting your account is permanent. All your bookings, saved venues, and credits will be lost.</p>
        <Button variant="outline" className="text-xs py-2 px-3 text-red-500 border-red-300 hover:bg-red-100" onClick={() => setDeleteModal(true)}>
          <Trash2 className="h-3 w-3" />Delete Account
        </Button>
      </div>

      <Modal open={deleteModal} onClose={() => { setDeleteModal(false); setDeleteConfirm(''); }} title="Delete Account">
        <div className="space-y-4">
          <div className="rounded-input bg-red-50 border border-red-200 p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">This action is irreversible. All your data including bookings, saved venues, wallet credits, and reviews will be permanently deleted.</p>
          </div>
          <p className="text-sm text-gray-600">Type <span className="font-mono font-bold text-gray-900">DELETE</span> to confirm:</p>
          <input
            type="text"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="Type DELETE"
            className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setDeleteModal(false); setDeleteConfirm(''); }}>Cancel</Button>
            <Button
              variant="outline"
              className="flex-1 text-red-500 border-red-200 hover:bg-red-50 disabled:opacity-40"
              disabled={deleteConfirm !== 'DELETE'}
              onClick={() => {
                setDeleteModal(false);
                setDeleteConfirm('');
                setToast({ type: 'success', message: 'Account deletion request submitted' });
              }}
            >
              Delete My Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
