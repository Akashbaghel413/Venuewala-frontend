import { Search, Eye, Scale, Calendar, CreditCard, PartyPopper } from 'lucide-react';

const steps = [
  { title: 'Search', description: 'Search by name, pincode or area', icon: Search },
  { title: 'Check Availability', description: 'See live slot availability', icon: Eye },
  { title: 'Compare', description: 'Compare prices & packages', icon: Scale },
  { title: 'Book Online', description: 'Book your preferred slot', icon: Calendar },
  { title: 'Pay 25% Advance', description: 'Secure booking with small deposit', icon: CreditCard },
  { title: 'Celebrate!', description: 'Your event is ready!', icon: PartyPopper },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-app">
        <h2 className="text-[22px] font-semibold text-gray-900 mb-2 text-center">
          How It Works
        </h2>
        <p className="text-sm text-gray-500 mb-10 text-center">Six simple steps to your perfect event</p>

        {/* Desktop: horizontal with dashed line */}
        <div className="hidden md:block relative">
          {/* Dashed connecting line */}
          <div className="absolute top-7 left-[60px] right-[60px] border-t-2 border-dashed border-primary-200" />

          <div className="grid grid-cols-6 gap-4 relative">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex flex-col items-center text-center relative">
                  {/* Step number circle */}
                  <div className="relative mb-4 z-10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-primary-500 text-[10px] font-bold text-primary-500">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden space-y-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex items-start gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-sm shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 h-12 bg-primary-200" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{step.title}</h3>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
