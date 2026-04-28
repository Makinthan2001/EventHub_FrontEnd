import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import heroImage from "../../assets/images/hero.avif";
const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] py-32 px-6 overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <img
        src={heroImage}
        alt="Event celebration"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/75 to-slate-900/85" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium">
          <Calendar className="w-4 h-4" />
          <span>Your Complete Event Management Solution</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-white">
          Discover Amazing
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Events Near You
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
          Join thousands of event enthusiasts. Create, discover, and manage
          memorable events all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
          <Link
            to="/events"
            className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-full font-semibold text-lg shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300"
          >
            Explore Events
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300"
          >
            Get Started Free
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-16">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              1000+
            </div>
            <div className="text-gray-300 text-sm md:text-base">
              Events Created
            </div>
          </div>
          <div className="text-center border-x border-white/20">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              5000+
            </div>
            <div className="text-gray-300 text-sm md:text-base">
              Active Users
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              50+
            </div>
            <div className="text-gray-300 text-sm md:text-base">Categories</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
