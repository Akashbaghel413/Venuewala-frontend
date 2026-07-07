import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import Button from '../ui/Button';

const benefits = [
  'Free listing, pay only on booking',
  'Instant booking notifications',
  'Secure & timely payouts',
];

export default function PartnerCtaSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-[12px] overflow-hidden border border-gray-100 bg-gray-50 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          {/* Left: Text content */}
          <div className="p-6 md:p-10">
            <h2 className="text-[22px] font-semibold text-gray-900 mb-2">
              Own a Venue? List it on Venuewala
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Join 500+ venue owners across Delhi NCR. Get instant bookings and grow your business.
            </p>

            {/* Benefits with green checkmarks */}
            <ul className="space-y-3 mb-6">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  {b}
                </li>
              ))}
            </ul>

            <Link to="/onboarding/owner">
              <Button variant="cta" className="text-sm px-6 py-3">
                List Your Venue Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Right: Image */}
          <div className="relative h-48 md:h-full min-h-[250px]">
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"
              alt="Venue owner"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-transparent to-transparent md:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
