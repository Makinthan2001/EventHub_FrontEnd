import React from 'react';
import { Filter, Tag, Calendar, MapPin } from 'lucide-react';

interface FiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedDate,
  setSelectedDate,
  selectedLocation,
  setSelectedLocation
}) => {
  const categories = [
    'All Categories',
    'Music',
    'Tech',
    'Education',
    'Sports',
    'Business',
    'Art'
  ];

  const locations = [
    'All Locations',
    'New York',
    'San Francisco',
    'Boston',
    'Chicago',
    'Los Angeles',
    'Miami',
    'Austin',
    'Seattle',
    'Silicon Valley',
    'Portland',
    'Denver'
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Tag className="w-5 h-5 text-slate-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 appearance-none cursor-pointer bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 cursor-pointer"
            placeholder="mm/dd/yyyy"
          />
        </div>

        {/* Location Filter */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <MapPin className="w-5 h-5 text-slate-400" />
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 appearance-none cursor-pointer bg-white"
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
