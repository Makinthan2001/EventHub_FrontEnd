import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, LogOut } from "lucide-react";
import logo from "../assets/images/eventhub-logo.png";
import { authService } from "../features/auth/services/auth.service";
import { User } from "../types";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setAuthChecked(true);
  }, []);

  const handleLogout = async () => {
    authService.logout();
    setUser(null);
    navigate("/");
  };

  const dashboardPath = user?.role === 'admin' ? "/admin-dashboard" : "/organizer-dashboard";

  return (
    <nav className="bg-white/90 backdrop-blur border-b border-slate-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Uva Event Masters" className="h-14" />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-slate-700 font-medium hover:text-slate-900 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/events"
              className="text-slate-700 font-medium hover:text-slate-900 transition-colors"
            >
              Events
            </Link>
            {(user?.role === 'organizer' || user?.role === 'admin') && (
              <Link
                to="/create-event"
                className="text-slate-700 font-medium hover:text-slate-900 transition-colors"
              >
                Create Event
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {authChecked &&
              (user ? (
                <>
                  <Link
                    to={dashboardPath}
                    className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100"
                    title="Dashboard"
                  >
                    <UserCircle className="w-7 h-7" />
                    <span className="font-medium">{user.full_name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-slate-700 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-700 font-medium hover:text-slate-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
                  >
                    Register
                  </Link>
                </>
              ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
