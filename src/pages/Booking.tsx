import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Calendar, CheckCircle, ChevronDown, ChevronUp,
  MapPin, Users, Star, ShieldCheck, Download, ArrowRight, Phone,
  Home, Loader2, Lock, Check,
} from 'lucide-react';
import { featuredVenues, eventTypes } from '../data/venues';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

type Slot = 'morning' | 'evening' | 'fullDay';
type FoodPref = 'veg' | 'veg-nonveg' | 'no-catering';
type PaymentMethod = 'upi' | 'netbanking' | 'card' | 'emi';

const slotLabels: Record<Slot, string> = {
  morning: 'Morning (8 AM \u2013 2 PM)',
  evening: 'Evening (4 PM \u2013 11 PM)',
  fullDay: 'Full Day (8 AM \u2013 11 PM)',
};

const foodLabels: Record<FoodPref, string> = {
  veg: 'Veg Only',
  'veg-nonveg': 'Veg + Non-Veg',
  'no-catering': 'No Catering',
};

const cancellationPolicy = [
  'Free cancellation within 7 days of booking date or 3 months before the event date, whichever is earlier.',
  'After the free cancellation window, 50% of the advance payment will be forfeited.',
  'No cancellations within 30 days of the event date \u2014 the full advance is non-refundable.',
  'Date changes are subject to availability and must be requested at least 15 days before the original booking date.',
  'Venuewala reserves the right to cancel a booking if the venue becomes unavailable due to unforeseen circumstances, in which case a full refund will be issued.',
];

const upiApps = [
  { name: 'Google Pay', color: '#4285F4' },
  { name: 'PhonePe', color: '#5F259F' },
  { name: 'Paytm', color: '#002970' },
];

const banks = [
  'HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra',
  'Yes Bank', 'PNB', 'BOB', 'Union Bank', 'Canara Bank',
];

const emiOptions = [
  { months: 3, interest: 0, label: '3 months \u2014 No Cost EMI' },
  { months: 6, interest: 0, label: '6 months \u2014 No Cost EMI' },
  { months: 12, interest: 1.5, label: '12 months \u2014 1.5% interest/month' },
];

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('venue') || '1';
  const venue = featuredVenues.find((v) => v.id === venueId) || featuredVenues[0];

  const [step, setStep] = useState(1);
  const today = new Date().toISOString().split('T')[0];

  // Step 1 fields
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState<Slot>('fullDay');
  const [guests, setGuests] = useState(100);
  const [eventType, setEventType] = useState('Wedding');
  const [foodPref, setFoodPref] = useState<FoodPref>('veg');
  const [specialRequests, setSpecialRequests] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2 fields
  const [agreed, setAgreed] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  // Step 3 fields
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [selectedUpi, setSelectedUpi] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedEmi, setSelectedEmi] = useState(3);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [paying, setPaying] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);

  const bookingId = useMemo(() => 'VW-2024-' + Math.random().toString(36).slice(2, 7).toUpperCase(), []);

  const pricing = useMemo(() => {
    const slotPrice = venue.pricing[slot];
    const hasCatering = foodPref !== 'no-catering';
    const basePrice = hasCatering ? slotPrice.withCatering : slotPrice.venueOnly;
    const cateringCost = hasCatering ? 800 * guests : 0;
    const platformFee = Math.round((basePrice + cateringCost) * 0.05);
    const gstOnPlatform = Math.round(platformFee * 0.18);
    const total = basePrice + cateringCost + platformFee + gstOnPlatform;
    const advance = Math.round(total * 0.25);
    const balance = total - advance;
    return { basePrice, cateringCost, platformFee, gstOnPlatform, total, advance, balance };
  }, [venue, slot, foodPref, guests]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!date) newErrors.date = 'Please select an event date';
    if (!guests || guests < 10) newErrors.guests = 'Minimum 10 guests required';
    if (guests > venue.capacity) newErrors.guests = `Maximum capacity is ${venue.capacity} guests`;
    if (!eventType) newErrors.eventType = 'Please select event type';
    if (!contactName.trim()) newErrors.contactName = 'Full name is required';
    if (contactPhone.length !== 10) newErrors.contactPhone = 'Enter a valid 10-digit phone number';
    if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) newErrors.contactEmail = 'Enter a valid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Continue = () => {
    if (validateStep1()) setStep(2);
  };

  const handlePayment = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setBookingDone(true);
    }, 2000);
  };

  // Format card number with spaces
  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  // Format expiry MM/YY
  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  return (
    <div className="min-h-screen bg-cream pb-8">
      <div className="container-app py-6 max-w-3xl">

        {/* \u2014\u2014 PROGRESS BAR \u2014\u2014 */}
        {!bookingDone && (
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Connecting line background */}
              <div className="absolute top-4 left-10 right-10 h-0.5 bg-gray-200" />
              {/* Connecting line progress */}
              <div
                className="absolute top-4 left-10 h-0.5 bg-primary-500 transition-all duration-500"
                style={{ right: step === 1 ? '66.6%' : step === 2 ? '33.3%' : '0' }}
              />

              {[
                { n: 1, label: 'Booking Details' },
                { n: 2, label: 'Review & Confirm' },
                { n: 3, label: 'Payment' },
              ].map(({ n, label }) => (
                <div key={n} className="flex flex-col items-center z-10">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold border-2 transition-all duration-300 ${
                      step > n
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : step === n
                        ? 'bg-white border-primary-500 text-primary-500'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {step > n ? <Check className="h-4 w-4" /> : n}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${step >= n ? 'text-primary-600' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* \u2014\u2014 STEP 1: BOOKING DETAILS \u2014\u2014 */}
        {step === 1 && !bookingDone && (
          <div className="space-y-5">
            {/* Venue summary card */}
            <div className="rounded-card bg-white p-4 shadow-sm flex gap-4 items-center">
              <img
                src={venue.images[0]}
                alt={venue.name}
                className="h-20 w-28 rounded-input object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900">{venue.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />{venue.area}, {venue.city}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-sm flex-wrap">
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{venue.rating}</span>
                    <span className="text-gray-400">({venue.reviews})</span>
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Users className="h-3.5 w-3.5" />Up to {venue.capacity} guests
                  </span>
                  {venue.verified && (
                    <Badge variant="success"><ShieldCheck className="h-3 w-3" />Verified</Badge>
                  )}
                </div>
                <div className="mt-1 text-sm font-bold text-gray-900">
                  \u20b9{venue.price.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-gray-500"> / day</span>
                </div>
              </div>
            </div>

            {/* Booking details form */}
            <div className="rounded-card bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
                <Calendar className="h-5 w-5 text-primary-500" /> Event Details
              </h2>
              <div className="space-y-4">
                {/* Date + Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Date *</label>
                    <input
                      type="date"
                      value={date}
                      min={today}
                      onChange={(e) => { setDate(e.target.value); setErrors((p) => ({ ...p, date: '' })); }}
                      className={`w-full rounded-input border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors ${errors.date ? 'border-red-400 focus:border-red-400 focus:ring-red-400 bg-red-50' : 'border-gray-200 focus:border-primary-400 focus:ring-primary-400'}`}
                    />
                    {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Time Slot *</label>
                    <div className="space-y-1.5">
                      {(['morning', 'evening', 'fullDay'] as Slot[]).map((s) => (
                        <label
                          key={s}
                          className={`flex items-center gap-2 rounded-input border px-3 py-2 text-sm cursor-pointer transition-colors ${
                            slot === s ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="slot"
                            checked={slot === s}
                            onChange={() => setSlot(s)}
                            className="h-3.5 w-3.5 text-primary-500 focus:ring-primary-400"
                          />
                          {slotLabels[s]}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Guests + Event type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Expected Guests * <span className="text-gray-400 font-normal">(max {venue.capacity})</span>
                    </label>
                    <div className="flex items-center rounded-input border border-gray-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(10, g - 10))}
                        className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors font-bold text-lg leading-none border-r border-gray-200"
                      >
                        \u2212
                      </button>
                      <input
                        type="number"
                        min={10}
                        max={venue.capacity}
                        value={guests}
                        onChange={(e) => { setGuests(Math.max(10, Math.min(venue.capacity, Number(e.target.value)))); setErrors((p) => ({ ...p, guests: '' })); }}
                        className="flex-1 text-center text-sm font-semibold text-gray-900 py-2.5 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.min(venue.capacity, g + 10))}
                        className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors font-bold text-lg leading-none border-l border-gray-200"
                      >
                        +
                      </button>
                    </div>
                    {errors.guests && <p className="text-xs text-red-500 mt-1">{errors.guests}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Type *</label>
                    <select
                      value={eventType}
                      onChange={(e) => { setEventType(e.target.value); setErrors((p) => ({ ...p, eventType: '' })); }}
                      className={`w-full rounded-input border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors ${errors.eventType ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-primary-400 focus:ring-primary-400'}`}
                    >
                      <option value="">Select event type</option>
                      {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.eventType && <p className="text-xs text-red-500 mt-1">{errors.eventType}</p>}
                  </div>
                </div>

                {/* Food preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Food Preference *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['veg', 'veg-nonveg', 'no-catering'] as FoodPref[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFoodPref(f)}
                        className={`rounded-input border px-3 py-2.5 text-sm font-medium transition-colors ${
                          foodPref === f
                            ? 'border-primary-400 bg-primary-50 text-primary-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {foodLabels[f]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Requests</label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Decoration preferences, dietary restrictions, setup requirements..."
                    className="w-full rounded-input border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 resize-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="rounded-card bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
                <Phone className="h-5 w-5 text-primary-500" /> Contact Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => { setContactName(e.target.value); setErrors((p) => ({ ...p, contactName: '' })); }}
                    placeholder="Your full name"
                    className={`w-full rounded-input border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors ${errors.contactName ? 'border-red-400 focus:border-red-400 focus:ring-red-400 bg-red-50' : 'border-gray-200 focus:border-primary-400 focus:ring-primary-400'}`}
                  />
                  {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (10 digits) *</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => { setContactPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setErrors((p) => ({ ...p, contactPhone: '' })); }}
                      placeholder="9876543210"
                      className={`w-full rounded-input border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors ${errors.contactPhone ? 'border-red-400 focus:border-red-400 focus:ring-red-400 bg-red-50' : 'border-gray-200 focus:border-primary-400 focus:ring-primary-400'}`}
                    />
                    {errors.contactPhone && <p className="text-xs text-red-500 mt-1">{errors.contactPhone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => { setContactEmail(e.target.value); setErrors((p) => ({ ...p, contactEmail: '' })); }}
                      placeholder="you@example.com"
                      className={`w-full rounded-input border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors ${errors.contactEmail ? 'border-red-400 focus:border-red-400 focus:ring-red-400 bg-red-50' : 'border-gray-200 focus:border-primary-400 focus:ring-primary-400'}`}
                    />
                    {errors.contactEmail && <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>}
                  </div>
                </div>
              </div>
            </div>

            <Button variant="primary" className="w-full py-3" onClick={handleStep1Continue}>
              Continue to Review <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* \u2014\u2014 STEP 2: REVIEW & CONFIRM \u2014\u2014 */}
        {step === 2 && !bookingDone && (
          <div className="space-y-5">
            {/* Booking summary */}
            <div className="rounded-card bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Booking Summary</h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-primary-500 font-medium hover:text-primary-600 transition-colors"
                >
                  Edit Booking
                </button>
              </div>

              {/* Venue mini card */}
              <div className="flex gap-3 mb-4 p-3 bg-gray-50 rounded-input">
                <img src={venue.images[0]} alt={venue.name} className="h-14 w-20 rounded object-cover shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{venue.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{venue.area}, {venue.city}</p>
                  <p className="text-xs text-primary-600 font-medium mt-1">{date} \u00b7 {slotLabels[slot]}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {[
                  ['Guests', `${guests}`],
                  ['Food', foodLabels[foodPref]],
                  ['Event Type', eventType],
                  ['Contact', contactName],
                  ['Phone', contactPhone],
                  ['Email', contactEmail],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
                {specialRequests && (
                  <div className="pt-1.5">
                    <span className="text-gray-500">Special Requests: </span>
                    <span className="text-gray-700">{specialRequests}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="rounded-card bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Price Breakdown</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Base price ({slotLabels[slot]})</span>
                  <span className="text-gray-900">\u20b9{pricing.basePrice.toLocaleString('en-IN')}</span>
                </div>
                {pricing.cateringCost > 0 && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Catering (\u20b9800 \u00d7 {guests} guests)</span>
                    <span className="text-gray-900">\u20b9{pricing.cateringCost.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Platform fee (5%)</span>
                  <span className="text-gray-900">\u20b9{pricing.platformFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">GST on platform fee (18%)</span>
                  <span className="text-gray-900">\u20b9{pricing.gstOnPlatform.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-base">
                  <span>Total Amount</span>
                  <span className="text-gray-900">\u20b9{pricing.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-semibold text-base text-coral-500">
                  <span>Advance payable now (25%)</span>
                  <span>\u20b9{pricing.advance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Balance due on event day</span>
                  <span>\u20b9{pricing.balance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Cancellation policy accordion */}
            <div className="rounded-card bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setPolicyOpen(!policyOpen)}
                className="w-full flex items-center justify-between p-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Cancellation Policy
                {policyOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </button>
              {policyOpen && (
                <div className="px-4 pb-4 text-sm text-gray-600 space-y-2 border-t border-gray-100">
                  {cancellationPolicy.map((p, i) => (
                    <p key={i} className="flex items-start gap-2 pt-2">
                      <span className="text-primary-400 mt-0.5 shrink-0">\u2022</span>
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Agreement checkbox */}
            <label className="flex items-start gap-3 rounded-card bg-white p-4 shadow-sm cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400 mt-0.5"
              />
              <span className="text-sm text-gray-700">
                I agree to Venuewala's <span className="text-primary-500 font-medium">booking terms</span> and{' '}
                <span className="text-primary-500 font-medium">cancellation policy</span>. I confirm all event details entered are accurate.
              </span>
            </label>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 py-3" onClick={() => setStep(1)}>Back</Button>
              <Button
                variant="primary"
                className="flex-1 py-3"
                disabled={!agreed}
                onClick={() => setStep(3)}
              >
                Proceed to Payment <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* \u2014\u2014 STEP 3: PAYMENT \u2014\u2014 */}
        {step === 3 && !bookingDone && (
          <div className="space-y-5">
            {/* Amount banner */}
            <div className="rounded-card bg-primary-500 p-5 text-center">
              <p className="text-primary-100 text-sm font-medium mb-1">25% Advance \u2014 Pay Now</p>
              <p className="text-4xl font-bold text-white">\u20b9{pricing.advance.toLocaleString('en-IN')}</p>
              <p className="text-primary-200 text-xs mt-1.5">Total booking value: \u20b9{pricing.total.toLocaleString('en-IN')}</p>
            </div>

            {/* Payment methods */}
            <div className="rounded-card bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Choose Payment Method</h2>
              <div className="space-y-3">

                {/* UPI */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`rounded-input border p-4 cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <input type="radio" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="h-4 w-4 text-primary-500 focus:ring-primary-400" />
                    <span className="text-sm font-semibold text-gray-900">UPI</span>
                    <span className="text-xs text-gray-500">Instant transfer</span>
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="flex gap-2 pl-7">
                      {upiApps.map((app) => (
                        <button
                          key={app.name}
                          onClick={(e) => { e.stopPropagation(); setSelectedUpi(app.name); }}
                          className={`flex-1 py-2 rounded-input border text-xs font-semibold transition-colors ${selectedUpi === app.name ? 'border-primary-400 bg-primary-500 text-white' : 'border-gray-200 text-gray-700 hover:border-primary-300'}`}
                        >
                          {app.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Net Banking */}
                <div
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`rounded-input border p-4 cursor-pointer transition-colors ${paymentMethod === 'netbanking' ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <input type="radio" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} className="h-4 w-4 text-primary-500 focus:ring-primary-400" />
                    <span className="text-sm font-semibold text-gray-900">Net Banking</span>
                    <span className="text-xs text-gray-500">All major banks</span>
                  </div>
                  {paymentMethod === 'netbanking' && (
                    <div className="pl-7">
                      <select
                        value={selectedBank}
                        onChange={(e) => { e.stopPropagation(); setSelectedBank(e.target.value); }}
                        className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="">Select your bank</option>
                        {banks.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                {/* Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`rounded-input border p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-4 w-4 text-primary-500 focus:ring-primary-400" />
                    <span className="text-sm font-semibold text-gray-900">Credit / Debit Card</span>
                    <span className="text-xs text-gray-500">Visa, Mastercard, Rupay</span>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="pl-7 space-y-3" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm font-mono focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 tracking-widest"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm font-mono focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            placeholder="\u2022\u2022\u2022"
                            maxLength={3}
                            className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm font-mono focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Name on Card</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="As printed on card"
                          className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* EMI */}
                <div
                  onClick={() => setPaymentMethod('emi')}
                  className={`rounded-input border p-4 cursor-pointer transition-colors ${paymentMethod === 'emi' ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <input type="radio" checked={paymentMethod === 'emi'} onChange={() => setPaymentMethod('emi')} className="h-4 w-4 text-primary-500 focus:ring-primary-400" />
                    <span className="text-sm font-semibold text-gray-900">EMI Options</span>
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">No Cost EMI Available</span>
                  </div>
                  {paymentMethod === 'emi' && (
                    <div className="pl-7 space-y-2" onClick={(e) => e.stopPropagation()}>
                      {emiOptions.map((opt) => {
                        const emiAmount = opt.interest > 0
                          ? Math.round(pricing.advance * (1 + opt.interest / 100) / opt.months)
                          : Math.round(pricing.advance / opt.months);
                        return (
                          <label
                            key={opt.months}
                            className={`flex items-center justify-between rounded-input border p-3 cursor-pointer transition-colors ${selectedEmi === opt.months ? 'border-primary-400 bg-white' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                checked={selectedEmi === opt.months}
                                onChange={() => setSelectedEmi(opt.months)}
                                className="h-3.5 w-3.5 text-primary-500 focus:ring-primary-400"
                              />
                              <span className="text-sm text-gray-700">{opt.label}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">\u20b9{emiAmount.toLocaleString('en-IN')}/mo</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pay button */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 py-3" onClick={() => setStep(2)} disabled={paying}>Back</Button>
              <Button
                variant="cta"
                className="flex-1 py-3"
                onClick={handlePayment}
                disabled={paying}
              >
                {paying ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Processing...</>
                ) : (
                  <><Lock className="h-4 w-4" />Pay \u20b9{pricing.advance.toLocaleString('en-IN')} Securely</>
                )}
              </Button>
            </div>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock className="h-3.5 w-3.5" />
              <span>100% Secure Payment \u00b7 SSL Encrypted \u00b7 PCI DSS Compliant</span>
            </div>
          </div>
        )}

        {/* \u2014\u2014 SUCCESS SCREEN \u2014\u2014 */}
        {bookingDone && (
          <div className="rounded-card bg-white p-8 shadow-sm text-center">
            {/* Animated checkmark */}
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 animate-bounce-once">
              <CheckCircle className="h-10 w-10 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-2">Your venue has been successfully reserved.</p>
            <p className="text-xs text-gray-400 mb-6">A confirmation has been sent to {contactEmail}</p>

            {/* Booking details */}
            <div className="max-w-sm mx-auto text-left rounded-card border border-gray-100 bg-gray-50 p-4 mb-6 space-y-2">
              {[
                ['Booking ID', bookingId],
                ['Venue', venue.name],
                ['Date', date],
                ['Time Slot', slotLabels[slot]],
                ['Guests', `${guests}`],
                ['Amount Paid', `\u20b9${pricing.advance.toLocaleString('en-IN')}`],
                ['Balance Due', `\u20b9${pricing.balance.toLocaleString('en-IN')} (on event day)`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <Button variant="outline" onClick={() => {}}>
                <Download className="h-4 w-4" /> Download Receipt
              </Button>
              <Button variant="primary" onClick={() => navigate('/dashboard/user')}>
                View My Bookings
              </Button>
            </div>

            <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1">
              <Home className="h-3.5 w-3.5" />Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
