// User Dashboard Data
export interface UserBooking {
  id: string;
  venueId: string;
  venueName: string;
  venueImage: string;
  venueArea: string;
  date: string;
  slot: string;
  guests: number;
  amountPaid: number;
  balanceDue: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  canCancel: boolean;
  canReview: boolean;
}

export const userBookings: UserBooking[] = [
  {
    id: 'UB-001',
    venueId: '1',
    venueName: 'Shree Ram Banquet Hall',
    venueImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200',
    venueArea: 'Dwarka, New Delhi',
    date: '2026-07-15',
    slot: 'Full Day',
    guests: 350,
    amountPaid: 38125,
    balanceDue: 114375,
    status: 'confirmed',
    canCancel: true,
    canReview: false,
  },
  {
    id: 'UB-002',
    venueId: '2',
    venueName: 'Green Valley Farmhouse',
    venueImage: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=200',
    venueArea: 'Chattarpur, New Delhi',
    date: '2026-08-20',
    slot: 'Evening',
    guests: 500,
    amountPaid: 47500,
    balanceDue: 142500,
    status: 'pending',
    canCancel: true,
    canReview: false,
  },
  {
    id: 'UB-003',
    venueId: '3',
    venueName: 'Ambedkar Community Centre',
    venueImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200',
    venueArea: 'Rohini, Delhi',
    date: '2026-05-10',
    slot: 'Morning',
    guests: 150,
    amountPaid: 13000,
    balanceDue: 39000,
    status: 'completed',
    canCancel: false,
    canReview: true,
  },
  {
    id: 'UB-004',
    venueId: '5',
    venueName: 'Royal Celebration Hall',
    venueImage: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=200',
    venueArea: 'Gurugram',
    date: '2026-04-02',
    slot: 'Full Day',
    guests: 600,
    amountPaid: 62500,
    balanceDue: 187500,
    status: 'cancelled',
    canCancel: false,
    canReview: false,
  },
];

export interface SavedVenue {
  id: string;
  name: string;
  image: string;
  area: string;
  price: number;
  rating: number;
}

export const savedVenues: SavedVenue[] = [
  { id: '1', name: 'Shree Ram Banquet Hall', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200', area: 'Dwarka, New Delhi', price: 85000, rating: 4.8 },
  { id: '9', name: 'Lotus Garden Banquet', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200', area: 'Noida Sector 18', price: 35000, rating: 4.7 },
  { id: '12', name: 'Paradise Farmhouse', image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=200', area: 'Mehrauli, South Delhi', price: 180000, rating: 4.8 },
];

export interface SiteVisit {
  id: string;
  venueName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export const siteVisits: SiteVisit[] = [
  { id: 'SV-001', venueName: 'Green Valley Farmhouse', date: '2026-06-22', time: '11:00 AM', status: 'scheduled' },
  { id: 'SV-002', venueName: 'Krishna Bhavan', date: '2026-06-25', time: '3:00 PM', status: 'scheduled' },
  { id: 'SV-003', venueName: 'Shree Ram Banquet Hall', date: '2026-05-28', time: '10:00 AM', status: 'completed' },
];

export interface MyReview {
  id: string;
  venueName: string;
  rating: number;
  text: string;
  date: string;
}

export const myReviews: MyReview[] = [
  { id: 'MR-001', venueName: 'Ambedkar Community Centre', rating: 5, text: 'My daughter\'s birthday was magical! Affordable and well-maintained. The advance payment system made it stress-free.', date: '2026-05-12' },
  { id: 'MR-002', venueName: 'Shree Ram Banquet Hall', rating: 4, text: 'Great venue for our family function. The hall was beautiful. Only wish the parking was better organized.', date: '2026-05-30' },
];

export interface WalletTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
}

export const walletTransactions: WalletTransaction[] = [
  { id: 'WT-001', date: '2026-06-10', description: 'Referral bonus — Rahul Sharma', amount: 500, type: 'credit' },
  { id: 'WT-002', date: '2026-06-05', description: 'Cancellation refund — Royal Celebration', amount: 750, type: 'credit' },
  { id: 'WT-003', date: '2026-05-20', description: 'Booking advance — Ambedkar Centre', amount: 13000, type: 'debit' },
  { id: 'WT-004', date: '2026-05-01', description: 'Referral bonus — Sunita Verma', amount: 500, type: 'credit' },
];

// Owner Dashboard Data
export interface OwnerVenue {
  id: string;
  name: string;
  type: string;
  image: string;
  status: 'active' | 'paused' | 'pending';
}

export const ownerVenues: OwnerVenue[] = [
  { id: 'OV-1', name: 'Shree Ram Banquet Hall', type: 'Banquet Hall', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200', status: 'active' },
  { id: 'OV-2', name: 'Green Valley Farmhouse', type: 'Farmhouse', image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=200', status: 'active' },
  { id: 'OV-3', name: 'Ambedkar Community Centre', type: 'Community Centre', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200', status: 'paused' },
];

export interface OwnerBooking {
  id: string;
  clientName: string;
  eventType: string;
  date: string;
  slot: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  venueName: string;
}

export const ownerBookings: OwnerBooking[] = [
  { id: 'OB-001', clientName: 'Priya Singh', eventType: 'Wedding', date: '2026-07-15', slot: 'Full Day', amount: 152500, status: 'confirmed', venueName: 'Shree Ram Banquet Hall' },
  { id: 'OB-002', clientName: 'Amit Gupta', eventType: 'Birthday', date: '2026-07-22', slot: 'Evening', amount: 62000, status: 'pending', venueName: 'Green Valley Farmhouse' },
  { id: 'OB-003', clientName: 'Sunita Verma', eventType: 'Puja', date: '2026-08-05', slot: 'Morning', amount: 34000, status: 'pending', venueName: 'Shree Ram Banquet Hall' },
  { id: 'OB-004', clientName: 'Vikram Malhotra', eventType: 'Corporate', date: '2026-06-28', slot: 'Full Day', amount: 170000, status: 'confirmed', venueName: 'Green Valley Farmhouse' },
  { id: 'OB-005', clientName: 'Neha Kapoor', eventType: 'Anniversary', date: '2026-06-18', slot: 'Evening', amount: 115000, status: 'cancelled', venueName: 'Shree Ram Banquet Hall' },
];

export const monthlyBookings = [
  { month: 'Jan', bookings: 8 },
  { month: 'Feb', bookings: 12 },
  { month: 'Mar', bookings: 15 },
  { month: 'Apr', bookings: 10 },
  { month: 'May', bookings: 18 },
  { month: 'Jun', bookings: 22 },
];

export interface OwnerReview {
  id: string;
  reviewerName: string;
  venueName: string;
  rating: number;
  text: string;
  date: string;
  reply?: string;
}

export const ownerReviews: OwnerReview[] = [
  { id: 'OR-001', reviewerName: 'Priya Singh', venueName: 'Shree Ram Banquet Hall', rating: 5, text: 'Our wedding was magical! The hall was beautifully decorated.', date: '2026-05-20', reply: 'Thank you, Priya! We\'re glad you had a wonderful time.' },
  { id: 'OR-002', reviewerName: 'Rahul Sharma', venueName: 'Shree Ram Banquet Hall', rating: 5, text: 'Great corporate offsite venue. WiFi was reliable.', date: '2026-05-18' },
  { id: 'OR-003', reviewerName: 'Kavita Agarwal', venueName: 'Green Valley Farmhouse', rating: 5, text: 'The farmhouse is breathtaking! Poolside setup is world-class.', date: '2026-05-15' },
];

export interface Payout {
  id: string;
  date: string;
  amount: number;
  bank: string;
  status: 'completed' | 'pending' | 'processing';
}

export const payouts: Payout[] = [
  { id: 'PO-001', date: '2026-06-01', amount: 245000, bank: 'HDFC ****4521', status: 'completed' },
  { id: 'PO-002', date: '2026-05-01', amount: 180000, bank: 'HDFC ****4521', status: 'completed' },
  { id: 'PO-003', date: '2026-04-01', amount: 210000, bank: 'HDFC ****4521', status: 'completed' },
  { id: 'PO-004', date: '2026-06-15', amount: 152500, bank: 'HDFC ****4521', status: 'processing' },
];

// Calendar data for owner
export interface CalendarDay {
  date: string;
  status: 'booked' | 'pending' | 'available';
  bookingId?: string;
  clientName?: string;
}

export const calendarData: CalendarDay[] = [
  { date: '2026-06-18', status: 'available', clientName: 'Neha Kapoor' },
  { date: '2026-06-28', status: 'booked', bookingId: 'OB-004', clientName: 'Vikram Malhotra' },
  { date: '2026-07-15', status: 'booked', bookingId: 'OB-001', clientName: 'Priya Singh' },
  { date: '2026-07-22', status: 'pending', bookingId: 'OB-002', clientName: 'Amit Gupta' },
  { date: '2026-08-05', status: 'pending', bookingId: 'OB-003', clientName: 'Sunita Verma' },
  { date: '2026-07-08', status: 'booked', clientName: 'Sneha Kapoor' },
  { date: '2026-07-25', status: 'booked', clientName: 'Deepak Chopra' },
];
