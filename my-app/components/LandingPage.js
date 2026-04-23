'use client';

import { useState } from 'react';
import LoginPage from './LoginPage';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <LoginPage onBack={() => setShowLogin(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">🏨 HotelMS</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to HotelMS
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Your complete hotel management solution. Streamline bookings, manage rooms, 
            handle payments, and provide exceptional guest experiences.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Get Started
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🛏️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Room Management</h3>
            <p className="text-blue-100">Manage room types, availability, and maintenance schedules efficiently.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-white mb-2">Easy Bookings</h3>
            <p className="text-blue-100">Streamlined booking process for guests with instant confirmation.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-white mb-2">Mobile Payments</h3>
            <p className="text-blue-100">Accept payments via Tigo, Airtel, and Halotel mobile money.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Alerts</h3>
            <p className="text-blue-100">Stay informed with instant notifications for all activities.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">For Guests</h2>
            <ul className="space-y-4">
              <li className="flex items-start text-blue-100">
                <span className="text-green-400 mr-3">✓</span>
                Search and book rooms online
              </li>
              <li className="flex items-start text-blue-100">
                <span className="text-green-400 mr-3">✓</span>
                View room types and amenities
              </li>
              <li className="flex items-start text-blue-100">
                <span className="text-green-400 mr-3">✓</span>
                Manage your bookings
              </li>
              <li className="flex items-start text-blue-100">
                <span className="text-green-400 mr-3">✓</span>
                Cancel bookings easily
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">For Staff</h2>
            <ul className="space-y-4">
              <li className="flex items-start text-blue-100">
                <span className="text-green-400 mr-3">✓</span>
                Efficient check-in/check-out process
              </li>
              <li className="flex items-start text-blue-100">
                <span className="text-green-400 mr-3">✓</span>
                Housekeeping task management
              </li>
              <li className="flex items-start text-blue-100">
                <span className="text-green-400 mr-3">✓</span>
                Invoice generation and tracking
              </li>
              <li className="flex items-start text-blue-100">
                <span className="text-green-400 mr-3">✓</span>
                Staff management dashboard
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Room Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 rounded-lg p-4 mb-4">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Standard</h3>
              <p className="text-blue-100 text-sm">Comfortable rooms with essential amenities</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 rounded-lg p-4 mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Deluxe</h3>
              <p className="text-blue-100 text-sm">Premium rooms with extra comforts</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-700 rounded-lg p-4 mb-4">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Family</h3>
              <p className="text-blue-100 text-sm">Spacious rooms for families</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-600 rounded-lg p-4 mb-4">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Business Suite</h3>
              <p className="text-blue-100 text-sm">Executive rooms with office space</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => setShowLogin(true)}
            className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start Your Experience
          </button>
        </div>
      </div>

      <footer className="bg-black/20 border-t border-white/20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-blue-100">
          <p>&copy; 2026 Hotel Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
