'use client';

import { useState } from 'react';
import LandingPage from '../components/LandingPage';
import LoginPage from '../components/LoginPage';
import RoomSearch from '../components/RoomSearch';
import BookingForm from '../components/BookingForm';
import GuestBookings from '../components/GuestBookings';
import RoomManagement from '../components/RoomManagement';
import ReceptionistDashboard from '../components/ReceptionistDashboard';
import CheckInOut from '../components/CheckInOut';
import HousekeepingManagement from '../components/HousekeepingManagement';
import PaymentSystem from '../components/PaymentSystem';
import NotificationCenter from '../components/NotificationCenter';
import ManagerDashboard from '../components/ManagerDashboard';
import InvoiceGenerator from '../components/InvoiceGenerator';
import { useAuth } from '../lib/context/AuthContext';
import { USER_ROLE } from '../lib/models/User';

export default function Home() {
  const { user, logout, hasRole } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showLanding, setShowLanding] = useState(true);

  if (showLanding && !user) {
    return <LandingPage />;
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'search':
        return <RoomSearch onBook={setSelectedRoom} />;
      case 'my-bookings':
        return <GuestBookings />;
      case 'rooms':
        return <RoomManagement />;
      case 'reception':
        return <ReceptionistDashboard />;
      case 'checkin':
        return <CheckInOut />;
      case 'housekeeping':
        return <HousekeepingManagement />;
      case 'payment':
        return <PaymentSystem />;
      case 'manager':
        return <ManagerDashboard />;
      case 'invoices':
        return <InvoiceGenerator />;
      default:
        if (hasRole('guest')) {
          return <RoomSearch onBook={setSelectedRoom} />;
        } else if (hasRole('receptionist')) {
          return <ReceptionistDashboard />;
        } else if (hasRole('housekeeper')) {
          return <HousekeepingManagement />;
        } else if (hasRole('manager')) {
          return <ManagerDashboard />;
        }
    }
  };

  const getNavItems = () => {
    const items = [];
    
    if (hasRole('guest')) {
      items.push({ id: 'search', label: 'Search Rooms' });
      items.push({ id: 'my-bookings', label: 'My Bookings' });
    }
    
    if (hasRole('receptionist') || hasRole('manager')) {
      items.push({ id: 'reception', label: 'Dashboard' });
      items.push({ id: 'checkin', label: 'Check-in/Out' });
      items.push({ id: 'rooms', label: 'Room Management' });
      items.push({ id: 'payment', label: 'Payments' });
      items.push({ id: 'invoices', label: 'Invoices' });
    }
    
    if (hasRole('housekeeper') || hasRole('manager') || hasRole('receptionist')) {
      items.push({ id: 'housekeeping', label: 'Housekeeping' });
    }
    
    if (hasRole('manager')) {
      items.push({ id: 'manager', label: 'Manager Dashboard' });
    }
    
    return items;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Hotel Management</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-4">
                {getNavItems().map(item => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              
              <NotificationCenter />
              
              <div className="flex items-center space-x-3 border-l pl-4">
                <span className="text-sm text-gray-700">{user.name}</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {user.role}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {renderPage()}
      </main>

      {selectedRoom && (
        <BookingForm
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}
