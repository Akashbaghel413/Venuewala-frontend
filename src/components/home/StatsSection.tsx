import { Building2, CalendarCheck, Star, MapPin } from 'lucide-react';

const statItems = [
  { value: '500+', label: 'Venues', icon: Building2 },
  { value: '10,000+', label: 'Events Booked', icon: CalendarCheck },
  { value: '4.8\u2605', label: 'Average Rating', icon: Star },
  { value: 'Across Delhi NCR', label: 'Coverage', icon: MapPin },
];

export default function StatsSection() {
  return (
    <section className="bg-primary-500 py-12">
      <div className="container-app">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <stat.icon className="h-6 w-6 text-primary-100" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-primary-100 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
