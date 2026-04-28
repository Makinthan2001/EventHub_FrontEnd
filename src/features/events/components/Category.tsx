import React, { useEffect, useState } from "react";
import {
  Music,
  Code,
  GraduationCap,
  Trophy,
  Briefcase,
  Palette,
  ArrowRight,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  categoryService,
  Category as CategoryType,
} from "../services/category.service";

const Category: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  // Predefined styles to cycle through
  const styles = [
    {
      icon: Music,
      color: "bg-pink-100 text-pink-600",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Code,
      color: "bg-blue-100 text-blue-600",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: GraduationCap,
      color: "bg-green-100 text-green-600",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Trophy,
      color: "bg-orange-100 text-orange-600",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      icon: Briefcase,
      color: "bg-purple-100 text-purple-600",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      icon: Palette,
      color: "bg-yellow-100 text-yellow-600",
      gradient: "from-yellow-400 to-orange-400",
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getStyle = (index: number) => {
    return styles[index % styles.length] || styles[0]!;
  };

  if (loading) {
    return <div className="py-24 text-center">Loading categories...</div>;
  }

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Popular{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Categories
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-xl">
              Explore events by category and find exactly what you're looking
              for.
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
          {categories.map((cat, index) => {
            const style = getStyle(index);
            const Icon = style.icon || Layers; // Fallback icon

            return (
              <Link
                key={cat.id}
                to={`/events?category=${cat.category_name}`}
                className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-3xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 border border-slate-200 hover:border-indigo-200"
              >
                {/* Image/Icon Container with gradient background */}
                <div
                  className={`relative h-32 flex items-center justify-center bg-gradient-to-br ${style.gradient} overflow-hidden`}
                >
                  {cat.image ? (
                    <>
                      <img
                        src={
                          cat.image.startsWith("http")
                            ? cat.image
                            : `http://localhost:8000${cat.image}`
                        }
                        alt={cat.category_name}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.currentTarget.style.display = "none";
                          const fallbackIcon =
                            e.currentTarget.nextElementSibling;
                          if (fallbackIcon) {
                            fallbackIcon.classList.remove("hidden");
                          }
                        }}
                      />
                      <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm">
                        <Icon className="w-16 h-16 text-slate-700 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </>
                  ) : (
                    <div className="relative z-10 flex items-center justify-center">
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <Icon className="w-16 h-16 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}
                  {/* Overlay gradient for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {cat.category_name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {Math.floor(Math.random() * 50) + 10}+ Events
                  </p>
                </div>

                {/* Hover indicator */}
                <div
                  className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${style.gradient} transform translate-y-full group-hover:translate-y-0 transition-transform duration-300`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Category;
