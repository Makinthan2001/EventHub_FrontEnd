import React from 'react';
import { Music, Code, GraduationCap, Trophy, Briefcase, Palette, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Category: React.FC = () => {
  const categories = [
    {
      id: 1,
      name: 'Music',
      icon: Music,
      count: '120+ Events',
      color: 'bg-pink-100 text-pink-600',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 2,
      name: 'Tech',
      icon: Code,
      count: '85+ Events',
      color: 'bg-blue-100 text-blue-600',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      id: 3,
      name: 'Education',
      icon: GraduationCap,
      count: '64+ Events',
      color: 'bg-green-100 text-green-600',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      name: 'Sports',
      icon: Trophy,
      count: '42+ Events',
      color: 'bg-orange-100 text-orange-600',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      id: 5,
      name: 'Business',
      icon: Briefcase,
      count: '95+ Events',
      color: 'bg-purple-100 text-purple-600',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      id: 6,
      name: 'Art',
      icon: Palette,
      count: '38+ Events',
      color: 'bg-yellow-100 text-yellow-600',
      gradient: 'from-yellow-400 to-orange-400'
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Categories</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-xl">
              Explore events by category and find exactly what you're looking for.
            </p>
          </div>
          <Link
            to="/events"
            className="group flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
          >
            View All Categories
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/events?category=${cat.name}`}
              className="group relative overflow-hidden bg-slate-50 rounded-3xl p-8 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 border border-slate-100"
            >
              <div className={`inline-flex p-4 rounded-2xl ${cat.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <cat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.name}</h3>
              <p className="text-slate-500 font-medium">{cat.count}</p>

              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${cat.gradient} transform translate-y-full group-hover:translate-y-0 transition-transform duration-300`} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
