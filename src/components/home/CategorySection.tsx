import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'farmhouse', name: 'Farmhouse', emoji: '🏡' },
  { id: 'banquet', name: 'Banquet Hall', emoji: '🍽️' },
  { id: 'dda-ground', name: 'DDA Ground', emoji: '🏟️' },
  { id: 'community-centre', name: 'Community Centre', emoji: '👥' },
  { id: 'bhavan', name: 'Bhavan / Hall', emoji: '🏛️' },
  { id: 'mandir', name: 'Mandir', emoji: '🛕' },
  { id: 'dharamshala', name: 'Dharamshala', emoji: '🏠' },
];

export default function CategorySection() {
  const navigate = useNavigate();

  return (
    <section className="py-10 bg-white">
      <div className="container-app">
        <h2 className="text-[22px] font-semibold text-gray-900 mb-2">
          Browse by Category
        </h2>
        <p className="text-sm text-gray-500 mb-5">Find the perfect type of venue for your event</p>

        {/* Horizontal scroll on mobile */}
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/search?category=${cat.id}`)}
              className="group flex flex-col items-center gap-2 min-w-[120px] rounded-[12px] border border-gray-100 bg-white p-4 hover:border-primary-500 hover:shadow-md transition-all duration-200"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-xs font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
