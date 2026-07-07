import { Star, ShieldCheck } from 'lucide-react';

const testimonials = [
  {
    id: 't1',
    name: 'Priya Singh',
    city: 'Dwarka, New Delhi',
    event: 'Wedding Reception',
    rating: 5,
    text: 'Our wedding at Shree Ram Banquet was absolutely perfect! The hall was beautifully decorated, the food was delicious, and the staff was incredibly helpful. Highly recommend!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: 't2',
    name: 'Rahul Sharma',
    city: 'Noida',
    event: 'Corporate Event',
    rating: 5,
    text: 'Hosted our annual company event at Green Valley Farmhouse. The venue was professional, WiFi was excellent, and the catering was top-notch. Will definitely book again.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    id: 't3',
    name: 'Sunita Verma',
    city: 'Janakpuri',
    event: 'Birthday Party',
    rating: 5,
    text: 'Celebrated my daughter\'s birthday at Ambedkar Community Centre. Very affordable and well-maintained. The advance payment system made it stress-free. Loved the experience!',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-cream">
      <div className="container-app">
        <h2 className="text-[22px] font-semibold text-gray-900 mb-2 text-center">
          What Our Customers Say
        </h2>
        <p className="text-sm text-gray-500 mb-8 text-center">Real reviews from verified bookings</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-[12px] border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-shadow"
            >
              {/* Profile and event */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{t.name}</h4>
                  <span className="text-xs text-gray-500">{t.city}</span>
                  <span className="text-xs text-gray-400"> • {t.event}</span>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>

              {/* Review text */}
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                "{t.text}"
              </p>

              {/* Verified badge */}
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E1F5EE] px-2.5 py-1 text-xs font-medium text-[#0F6E56]">
                <ShieldCheck className="h-3 w-3" />
                Verified Booking
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
