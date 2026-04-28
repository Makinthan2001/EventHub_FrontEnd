import React from "react";
import { Filter, Tag } from "lucide-react";

interface FiltersProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
      </div>

      <div className="max-w-md">
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
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
