// Admin Dashboard Data

export interface AdminVenue {
  id: string;
  name: string;
  owner: string;
  city: string;
  type: string;
  status: 'pending' | 'verified' | 'suspended';
  createdAt: string;
}

export const adminVenues: AdminVenue[] = [
  { id: 'AV-1', name: 'Shree Ram Banquet Hall', owner: 'Rahul Sharma', city: 'Dwarka', type: 'Banquet Hall', status: 'verified', createdAt: '2026-01-15' },
  { id: 'AV-2', name: 'Green Valley Farmhouse', owner: 'Rahul Sharma', city: 'Chattarpur', type: 'Farmhouse', status: 'verified', createdAt: '2026-02-10' },
  { id: 'AV-3', name: 'Ambedkar Community Centre', owner: 'Rahul Sharma', city: 'Rohini', type: 'Community Centre', status: 'verified', createdAt: '2026-03-05' },
  { id: 'AV-4', name: 'Lotus Garden Banquet', owner: 'Amit Gupta', city: 'Noida', type: 'Banquet Hall', status: 'pending', createdAt: '2026-06-15' },
  { id: 'AV-5', name: 'Sai Mandir Dharamshala', owner: 'Sunita Verma', city: 'Janakpuri', type: 'Mandir', status: 'verified', createdAt: '2026-04-20' },
  { id: 'AV-6', name: 'Krishna Bhavan', owner: 'Vikram Malhotra', city: 'Laxmi Nagar', type: 'Bhavan', status: 'suspended', createdAt: '2026-05-12' },
  { id: 'AV-7', name: 'Paradise Farmhouse', owner: 'Neha Kapoor', city: 'Mehrauli', type: 'Farmhouse', status: 'verified', createdAt: '2026-06-01' },
  { id: 'AV-8', name: 'Royal Celebration Hall', owner: 'Deepak Chopra', city: 'Gurugram', type: 'Farmhouse', status: 'verified', createdAt: '2026-06-10' },
];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  joinedDate: string;
  status: 'active' | 'suspended' | 'deleted';
  role: 'user' | 'owner';
}

export const adminUsers: AdminUser[] = [
  { id: 'AU-1', name: 'Priya Singh', email: 'priya.singh@gmail.com', phone: '+91 98765 43210', totalBookings: 5, joinedDate: '2026-01-10', status: 'active', role: 'user' },
  { id: 'AU-2', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+91 98765 43211', totalBookings: 0, joinedDate: '2026-01-15', status: 'active', role: 'owner' },
  { id: 'AU-3', name: 'Amit Gupta', email: 'amit.gupta@gmail.com', phone: '+91 98765 43212', totalBookings: 3, joinedDate: '2026-02-20', status: 'active', role: 'user' },
  { id: 'AU-4', name: 'Sunita Verma', email: 'sunita.verma@gmail.com', phone: '+91 98765 43213', totalBookings: 2, joinedDate: '2026-03-05', status: 'active', role: 'user' },
  { id: 'AU-5', name: 'Vikram Malhotra', email: 'vikram.malhotra@gmail.com', phone: '+91 98765 43214', totalBookings: 8, joinedDate: '2026-03-10', status: 'suspended', role: 'user' },
  { id: 'AU-6', name: 'Neha Kapoor', email: 'neha.kapoor@gmail.com', phone: '+91 98765 43215', totalBookings: 1, joinedDate: '2026-04-15', status: 'active', role: 'user' },
  { id: 'AU-7', name: 'Deepak Chopra', email: 'deepak.chopra@gmail.com', phone: '+91 98765 43216', totalBookings: 0, joinedDate: '2026-05-01', status: 'active', role: 'owner' },
  { id: 'AU-8', name: 'Kavita Agarwal', email: 'kavita.agarwal@gmail.com', phone: '+91 98765 43217', totalBookings: 4, joinedDate: '2026-05-20', status: 'active', role: 'user' },
];

export interface AdminBooking {
  id: string;
  client: string;
  venue: string;
  city: string;
  date: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

export const adminBookings: AdminBooking[] = [
  { id: 'AB-001', client: 'Priya Singh', venue: 'Shree Ram Banquet Hall', city: 'Dwarka', date: '2026-07-15', amount: 152500, status: 'confirmed', paymentStatus: 'paid' },
  { id: 'AB-002', client: 'Amit Gupta', venue: 'Green Valley Farmhouse', city: 'Chattarpur', date: '2026-07-22', amount: 62000, status: 'pending', paymentStatus: 'pending' },
  { id: 'AB-003', client: 'Sunita Verma', venue: 'Ambedkar Community Centre', city: 'Rohini', date: '2026-08-05', amount: 34000, status: 'pending', paymentStatus: 'pending' },
  { id: 'AB-004', client: 'Vikram Malhotra', venue: 'Shree Ram Banquet Hall', city: 'Dwarka', date: '2026-06-28', amount: 170000, status: 'confirmed', paymentStatus: 'paid' },
  { id: 'AB-005', client: 'Neha Kapoor', venue: 'Royal Celebration Hall', city: 'Gurugram', date: '2026-06-18', amount: 115000, status: 'cancelled', paymentStatus: 'refunded' },
  { id: 'AB-006', client: 'Kavita Agarwal', venue: 'Paradise Farmhouse', city: 'Mehrauli', date: '2026-08-10', amount: 290000, status: 'confirmed', paymentStatus: 'paid' },
];

export interface AdminPayout {
  id: string;
  owner: string;
  venue: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
  requestedDate: string;
  bank: string;
}

export const adminPayouts: AdminPayout[] = [
  { id: 'AP-001', owner: 'Rahul Sharma', venue: 'Shree Ram Banquet Hall', amount: 245000, status: 'pending', requestedDate: '2026-06-18', bank: 'HDFC ****4521' },
  { id: 'AP-002', owner: 'Deepak Chopra', venue: 'Royal Celebration Hall', amount: 180000, status: 'pending', requestedDate: '2026-06-17', bank: 'ICICI ****1234' },
  { id: 'AP-003', owner: 'Rahul Sharma', venue: 'Green Valley Farmhouse', amount: 120000, status: 'processing', requestedDate: '2026-06-15', bank: 'HDFC ****4521' },
  { id: 'AP-004', owner: 'Neha Kapoor', venue: 'Paradise Farmhouse', amount: 210000, status: 'completed', requestedDate: '2026-06-01', bank: 'SBI ****5678' },
  { id: 'AP-005', owner: 'Rahul Sharma', venue: 'Ambedkar Community Centre', amount: 85000, status: 'completed', requestedDate: '2026-05-15', bank: 'HDFC ****4521' },
];

export interface AdminReview {
  id: string;
  reviewer: string;
  venue: string;
  rating: number;
  text: string;
  date: string;
  flagged: boolean;
}

export const adminReviews: AdminReview[] = [
  { id: 'AR-001', reviewer: 'Priya Singh', venue: 'Shree Ram Banquet Hall', rating: 5, text: 'Our wedding was magical! The hall was beautifully decorated.', date: '2026-05-20', flagged: false },
  { id: 'AR-002', reviewer: 'Amit Gupta', venue: 'Green Valley Farmhouse', rating: 5, text: 'Great corporate offsite venue. WiFi was reliable.', date: '2026-05-18', flagged: false },
  { id: 'AR-003', reviewer: 'Spam User', venue: 'Shree Ram Banquet Hall', rating: 1, text: 'Fake review content', date: '2026-06-10', flagged: true },
  { id: 'AR-004', reviewer: 'Kavita Agarwal', venue: 'Green Valley Farmhouse', rating: 5, text: 'The farmhouse is breathtaking! Poolside setup is world-class.', date: '2026-05-15', flagged: false },
];

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'booking' | 'payment' | 'venue' | 'user' | 'payout';
}

export const activityLog: ActivityLog[] = [
  { id: 'AL-001', action: 'New booking confirmed', user: 'Priya Singh', timestamp: '2026-06-18 10:30', type: 'booking' },
  { id: 'AL-002', action: 'Payment received ₹38,125', user: 'Amit Gupta', timestamp: '2026-06-18 09:45', type: 'payment' },
  { id: 'AL-003', action: 'Venue submitted for verification', user: 'Amit Gupta', timestamp: '2026-06-18 09:00', type: 'venue' },
  { id: 'AL-004', action: 'Review flagged as inappropriate', user: 'Admin', timestamp: '2026-06-17 18:30', type: 'user' },
  { id: 'AL-005', action: 'Payout released ₹2,10,000', user: 'Neha Kapoor', timestamp: '2026-06-17 15:00', type: 'payout' },
  { id: 'AL-006', action: 'New user registered', user: 'Rohan Kumar', timestamp: '2026-06-17 14:20', type: 'user' },
  { id: 'AL-007', action: 'Venue verified', user: 'Admin', timestamp: '2026-06-16 11:00', type: 'venue' },
  { id: 'AL-008', action: 'Refund issued ₹12,500', user: 'Admin', timestamp: '2026-06-16 10:30', type: 'payment' },
  { id: 'AL-009', action: 'Booking cancelled', user: 'Neha Kapoor', timestamp: '2026-06-15 16:00', type: 'booking' },
  { id: 'AL-010', action: 'Venue suspended', user: 'Admin', timestamp: '2026-06-14 12:00', type: 'venue' },
];

// Chart data
export const monthlyRevenue = [
  { month: 'Jan', revenue: 1200000 },
  { month: 'Feb', revenue: 1450000 },
  { month: 'Mar', revenue: 1680000 },
  { month: 'Apr', revenue: 1520000 },
  { month: 'May', revenue: 1890000 },
  { month: 'Jun', revenue: 2150000 },
];

export const bookingsByType = [
  { name: 'Farmhouse', value: 35 },
  { name: 'Banquet Hall', value: 28 },
  { name: 'Community Centre', value: 18 },
  { name: 'Bhavan', value: 12 },
  { name: 'DDA Ground', value: 5 },
  { name: 'Mandir/Dharamshala', value: 2 },
];

export const kpiData = {
  totalVenues: 48,
  activeBookings: 24,
  revenueToday: 125000,
  newUsersToday: 5,
};
