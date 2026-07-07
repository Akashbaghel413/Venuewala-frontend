export const venueCategories = [
  { id: 'farmhouse', name: 'Farmhouse', icon: 'TreePine' },
  { id: 'banquet', name: 'Banquet Hall', icon: 'Building2' },
  { id: 'dda-ground', name: 'DDA Ground', icon: 'Trees' },
  { id: 'community-centre', name: 'Community Centre', icon: 'Users' },
  { id: 'bhavan', name: 'Bhavan / Hall', icon: 'Landmark' },
  { id: 'mandir', name: 'Mandir', icon: 'Church' },
  { id: 'dharamshala', name: 'Dharamshala', icon: 'Home' },
];

export const eventTypes = [
  'Wedding',
  'Birthday',
  'Corporate',
  'Puja',
  'Anniversary',
  'Other',
];

export const amenityList = [
  'Parking',
  'AC',
  'Catering',
  'Decoration',
  'Generator',
  'Sound System',
  'WiFi',
  'CCTV',
] as const;

export type Amenity = (typeof amenityList)[number];

// Standard venue images from Unsplash
const venueImages = {
  farmhouse: [
    'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800',
    'https://images.unsplash.com/photo-1564013799919-ab3000a5bf6d?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  ],
  banquet: [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    'https://images.unsplash.com/photo-1478146896981-bdfeafd44e54?w=800',
    'https://images.unsplash.com/photo-1510078815803-ffc9fcb3d7ab?w=800',
  ],
  garden: [
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
    'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800',
  ],
  community: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1497366842680-aa2277e0c9de?w=800',
  ],
  mandir: [
    'https://images.unsplash.com/photo-1545126276-1b02ea7c0e0f?w=800',
    'https://images.unsplash.com/photo-1582510003544-d47d1e077c7e?w=800',
  ],
};

export interface Venue {
  id: string;
  name: string;
  area: string;
  city: string;
  pincode: string;
  price: number;
  capacity: number;
  rating: number;
  reviews: number;
  category: string;
  images: string[];
  verified: boolean;
  amenities: Amenity[];
  foodAvailable: boolean;
  highlights: string[];
  description: string;
  address: string;
  landmarks: string[];
  pricing: {
    morning: { venueOnly: number; withCatering: number };
    evening: { venueOnly: number; withCatering: number };
    fullDay: { venueOnly: number; withCatering: number };
  };
  starBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
}

export const featuredVenues: Venue[] = [
  {
    id: '1',
    name: 'Shree Ram Banquet Hall',
    area: 'Dwarka',
    city: 'New Delhi',
    pincode: '110075',
    price: 85000,
    capacity: 500,
    rating: 4.8,
    reviews: 124,
    category: 'banquet',
    images: venueImages.banquet,
    verified: true,
    amenities: ['Parking', 'AC', 'Catering', 'Decoration', 'Generator', 'WiFi'],
    foodAvailable: true,
    highlights: ['Grand ballroom', 'LED lighting', 'Bridal suite', 'Valet parking'],
    description: 'Shree Ram Banquet Hall is a premium banquet venue in Dwarka with a grand ballroom, modern amenities, and excellent catering services.',
    address: 'Plot 45, Sector 22, Dwarka, New Delhi - 110075',
    landmarks: ['Near Dwarka Sector 21 Metro', 'Opposite Radisson Blu', '2 km from IGI Airport Terminal 3'],
    pricing: {
      morning: { venueOnly: 60000, withCatering: 100000 },
      evening: { venueOnly: 75000, withCatering: 115000 },
      fullDay: { venueOnly: 85000, withCatering: 145000 },
    },
    starBreakdown: { 5: 89, 4: 24, 3: 7, 2: 3, 1: 1 },
  },
  {
    id: '2',
    name: 'Green Valley Farmhouse',
    area: 'Chattarpur',
    city: 'New Delhi',
    pincode: '110074',
    price: 125000,
    capacity: 800,
    rating: 4.6,
    reviews: 89,
    category: 'farmhouse',
    images: venueImages.farmhouse,
    verified: true,
    amenities: ['Parking', 'AC', 'Catering', 'Decoration', 'Sound System', 'WiFi', 'CCTV'],
    foodAvailable: true,
    highlights: ['3-acre lawn', 'Poolside venue', 'Bridal villa', 'Celebrity-favorite'],
    description: 'Green Valley Farmhouse is a luxury farmhouse venue spread across 3 acres in Chattarpur with lush lawns, a poolside area, and premium amenities.',
    address: 'Asola Road, Chattarpur, New Delhi - 110074',
    landmarks: ['Near Chattarpur Metro', 'Adjacent to Asola Wildlife Sanctuary', '3 km from Qutub Minar'],
    pricing: {
      morning: { venueOnly: 95000, withCatering: 150000 },
      evening: { venueOnly: 115000, withCatering: 175000 },
      fullDay: { venueOnly: 125000, withCatering: 200000 },
    },
    starBreakdown: { 5: 52, 4: 25, 3: 8, 2: 3, 1: 1 },
  },
  {
    id: '3',
    name: 'Ambedkar Community Centre',
    area: 'Rohini',
    city: 'Delhi',
    pincode: '110085',
    price: 45000,
    capacity: 300,
    rating: 4.5,
    reviews: 67,
    category: 'community-centre',
    images: venueImages.community,
    verified: true,
    amenities: ['Parking', 'AC', 'Catering', 'Generator'],
    foodAvailable: true,
    highlights: ['Affordable pricing', 'AC hall', 'Stage setup', 'Power backup'],
    description: 'Ambedkar Community Centre is a well-maintained, budget-friendly venue in Rohini. The air-conditioned hall is ideal for birthdays, pujas, and community gatherings.',
    address: 'Block A, Sector 14, Rohini, Delhi - 110085',
    landmarks: ['Near Rohini West Metro', 'Adjacent to Japanese Park', '5 min from Rohini Court'],
    pricing: {
      morning: { venueOnly: 30000, withCatering: 52000 },
      evening: { venueOnly: 40000, withCatering: 62000 },
      fullDay: { venueOnly: 45000, withCatering: 72000 },
    },
    starBreakdown: { 5: 38, 4: 20, 3: 6, 2: 2, 1: 1 },
  },
  {
    id: '4',
    name: 'Lotus Garden Banquet',
    area: 'Noida',
    city: 'Sector 18',
    pincode: '201301',
    price: 35000,
    capacity: 250,
    rating: 4.3,
    reviews: 45,
    category: 'banquet',
    images: venueImages.banquet,
    verified: true,
    amenities: ['Parking', 'AC', 'Generator', 'CCTV'],
    foodAvailable: true,
    highlights: ['Garden lawn', 'AC banquet', 'Stage decor', 'Budget-friendly'],
    description: 'Lotus Garden Banquet offers a beautiful garden lawn combined with an AC banquet hall. Perfect for intimate weddings and milestone celebrations.',
    address: '12, Sector 18, Noida - 201301',
    landmarks: ['Near Sector 18 Metro Station', 'Behind Atta Market', 'Next to Noida Authority Office'],
    pricing: {
      morning: { venueOnly: 22000, withCatering: 38000 },
      evening: { venueOnly: 30000, withCatering: 48000 },
      fullDay: { venueOnly: 35000, withCatering: 55000 },
    },
    starBreakdown: { 5: 22, 4: 15, 3: 5, 2: 2, 1: 1 },
  },
  {
    id: '5',
    name: 'Royal Celebration Hall',
    area: 'Gurugram',
    city: 'Sector 42',
    pincode: '122001',
    price: 150000,
    capacity: 1000,
    rating: 4.9,
    reviews: 156,
    category: 'farmhouse',
    images: venueImages.farmhouse,
    verified: true,
    amenities: ['Parking', 'AC', 'Catering', 'Decoration', 'Generator', 'Sound System', 'WiFi', 'CCTV'],
    foodAvailable: true,
    highlights: ['5-acre luxury venue', 'Poolside setup', 'Bridal suite', 'Event planner included'],
    description: 'Royal Celebration Hall is a luxury farmhouse resort in Gurugram offering a poolside venue, manicured gardens, and a grand indoor hall. Perfect for lavish weddings.',
    address: 'Golf Course Road, Sector 42, Gurugram - 122001',
    landmarks: ['Near HUDA City Centre Metro', 'Adjacent to Golf Course', '3 km from Sahara Mall'],
    pricing: {
      morning: { venueOnly: 110000, withCatering: 180000 },
      evening: { venueOnly: 135000, withCatering: 210000 },
      fullDay: { venueOnly: 150000, withCatering: 250000 },
    },
    starBreakdown: { 5: 118, 4: 28, 3: 7, 2: 2, 1: 1 },
  },
  {
    id: '6',
    name: 'Krishna Bhavan',
    area: 'Laxmi Nagar',
    city: 'East Delhi',
    pincode: '110092',
    price: 25000,
    capacity: 200,
    rating: 4.1,
    reviews: 34,
    category: 'bhavan',
    images: venueImages.mandir,
    verified: true,
    amenities: ['Parking', 'Generator'],
    foodAvailable: false,
    highlights: ['Pure veg kitchen', 'Temple premises', 'AC hall', 'Budget-friendly'],
    description: 'Krishna Bhavan is a serene community hall in Laxmi Nagar, ideal for pujas, havans, and religious ceremonies. Features a dedicated temple area.',
    address: '9A, Laxmi Nagar, East Delhi - 110092',
    landmarks: ['Near Laxmi Nagar Metro', 'Opposite V3S Mall', '100m from Main Road'],
    pricing: {
      morning: { venueOnly: 18000, withCatering: 32000 },
      evening: { venueOnly: 22000, withCatering: 38000 },
      fullDay: { venueOnly: 25000, withCatering: 45000 },
    },
    starBreakdown: { 5: 14, 4: 12, 3: 5, 2: 2, 1: 1 },
  },
  {
    id: '7',
    name: 'Sai Mandir Dharamshala',
    area: 'Janakpuri',
    city: 'West Delhi',
    pincode: '110058',
    price: 30000,
    capacity: 200,
    rating: 4.4,
    reviews: 52,
    category: 'mandir',
    images: venueImages.mandir,
    verified: true,
    amenities: ['Parking', 'AC', 'Catering', 'CCTV'],
    foodAvailable: true,
    highlights: ['Sacred premises', 'Pure veg meals', 'Havankund on-site', 'Peaceful ambience'],
    description: 'Sai Mandir Dharamshala is located within the serene premises of a mandir in Janakpuri. Ideal for pujas, havans, upanayana ceremonies.',
    address: 'C-2 Block, Janakpuri, West Delhi - 110058',
    landmarks: ['Near Janakpuri West Metro', 'Opposite DTC Bus Depot', '500m from District Centre'],
    pricing: {
      morning: { venueOnly: 18000, withCatering: 34000 },
      evening: { venueOnly: 25000, withCatering: 42000 },
      fullDay: { venueOnly: 30000, withCatering: 50000 },
    },
    starBreakdown: { 5: 28, 4: 16, 3: 5, 2: 2, 1: 1 },
  },
  {
    id: '8',
    name: 'Paradise Farmhouse',
    area: 'Mehrauli',
    city: 'South Delhi',
    pincode: '110030',
    price: 180000,
    capacity: 700,
    rating: 4.8,
    reviews: 112,
    category: 'farmhouse',
    images: venueImages.farmhouse,
    verified: true,
    amenities: ['Parking', 'AC', 'Catering', 'Decoration', 'Generator', 'Sound System', 'WiFi', 'CCTV'],
    foodAvailable: true,
    highlights: ['7-acre luxury property', 'Swimming pool', 'Bridal suite', 'Celebrity venue'],
    description: 'Paradise Farmhouse is a celebrity-favorite luxury venue spread across 7 acres in Mehrauli. Features a swimming pool, sprawling lawns, and an opulent indoor hall.',
    address: 'Mehrauli-Gurgaon Road, South Delhi - 110030',
    landmarks: ['Near Qutub Minar', 'Adjacent to Mehrauli Archaeological Park', '5 km from Saket'],
    pricing: {
      morning: { venueOnly: 130000, withCatering: 210000 },
      evening: { venueOnly: 160000, withCatering: 250000 },
      fullDay: { venueOnly: 180000, withCatering: 290000 },
    },
    starBreakdown: { 5: 82, 4: 22, 3: 5, 2: 2, 1: 1 },
  },
];

export interface Review {
  id: string;
  venueId: string;
  name: string;
  image: string;
  event: string;
  rating: number;
  text: string;
  verified: boolean;
}

const profileImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
];

export const venueReviews: Review[] = [
  { id: 'r1', venueId: '1', name: 'Rahul Sharma', image: profileImages[0], event: 'Wedding', rating: 5, text: 'Our wedding at Shree Ram Banquet was magical! The hall was beautifully decorated and the catering was excellent. Highly recommend for weddings.', verified: true },
  { id: 'r2', venueId: '1', name: 'Priya Singh', image: profileImages[1], event: 'Corporate', rating: 5, text: 'Hosted our annual company event here. The WiFi was reliable, the catering was excellent, and the staff was very helpful throughout.', verified: true },
  { id: 'r3', venueId: '1', name: 'Amit Gupta', image: profileImages[2], event: 'Birthday', rating: 4, text: 'Great venue for my son\'s birthday party. Only suggestion — the parking could be better organized during peak hours.', verified: true },
  { id: 'r4', venueId: '2', name: 'Sunita Verma', image: profileImages[1], event: 'Anniversary', rating: 5, text: 'Celebrated our 25th anniversary at Green Valley Farmhouse. The lawn was stunning and the poolside setup was perfect!', verified: true },
  { id: 'r5', venueId: '2', name: 'Vikram Malhotra', image: profileImages[0], event: 'Puja', rating: 4, text: 'Arranged a griha pravesh puja. The open space was perfect for the havan setup. Catering was delicious and on time.', verified: true },
  { id: 'r6', venueId: '3', name: 'Neha Kapoor', image: profileImages[1], event: 'Corporate', rating: 4, text: 'Professional setup for our team event. The AC hall was comfortable and the stage setup was impressive.', verified: true },
  { id: 'r7', venueId: '5', name: 'Deepak Chopra', image: profileImages[2], event: 'Wedding', rating: 5, text: 'Royal Celebration Hall exceeded all expectations. The poolside venue, bridal suite, and the event planner made our wedding unforgettable.', verified: true },
  { id: 'r8', venueId: '5', name: 'Kavita Agarwal', image: profileImages[1], event: 'Birthday', rating: 5, text: 'Hosted a milestone birthday here. The resort feel is incredible — guests felt like they were on vacation. Worth every rupee!', verified: true },
  { id: 'r9', venueId: '8', name: 'Anita Reddy', image: profileImages[1], event: 'Wedding', rating: 5, text: 'Paradise Farmhouse is truly a celebrity-level venue. The 7-acre property, the swimming pool — everything was top-notch!', verified: true },
  { id: 'r10', venueId: '7', name: 'Suresh Mehta', image: profileImages[0], event: 'Wedding', rating: 5, text: 'Sai Mandir Dharamshala was perfect for our religious ceremony. The temple premises and pure veg catering were excellent!', verified: true },
];

export const howItWorksSteps = [
  { title: 'Search', description: 'Find venues by city, event type & date' },
  { title: 'Check Availability', description: 'See real-time slot availability' },
  { title: 'Check Price', description: 'Transparent pricing with no hidden charges' },
  { title: 'Book Slot', description: 'Reserve your preferred date instantly' },
  { title: 'Pay 25% Advance', description: 'Secure your booking with a small deposit' },
  { title: 'Confirm', description: 'Get instant confirmation & venue details' },
];

export const stats = [
  { label: 'Venues', value: '500+' },
  { label: 'Events Booked', value: '10,000+' },
  { label: 'Average Rating', value: '4.8★' },
  { label: 'Coverage', value: 'Across Delhi NCR' },
];

export const capacityOptions = [50, 100, 200, 500, 1000];

export const sortOptions = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
] as const;

export type SortOption = (typeof sortOptions)[number]['value'];
