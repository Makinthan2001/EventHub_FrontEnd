import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/eventhub-logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src={logo} alt="EventHub" className="h-14 brightness-0 invert" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted platform for discovering and managing events. Connect with organizers and attendees worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Create Event
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <a href="mailto:info@eventhub.com" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  info@eventhub.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-400" />
                <a href="tel:+15551234567" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                <p className="text-gray-400">123 Event Street, NY 10001</p>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Follow Us</h3>
            <p className="text-gray-400 text-sm mb-6">
              Stay connected with us on social media
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © 2025 EventHub. All rights reserved. |
            <a href="#" className="hover:text-indigo-400 transition-colors ml-1">Privacy Policy</a> |
            <a href="#" className="hover:text-indigo-400 transition-colors ml-1">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
