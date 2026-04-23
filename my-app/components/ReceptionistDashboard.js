'use client';

import { useState } from 'react';
import { useBookings } from '../lib/context/BookingContext';
import { useRooms } from '../lib/context/RoomContext';
import { useAuth } from '../lib/context/AuthContext';
import { BOOKING_STATUS } from '../lib/models/RoomBooking';

export default function ReceptionistDashboard() {
  const { bookings, updateBookingStatus, getActiveBookings } = useBookings();
  const { rooms } = useRooms();
  const { hasRole } = useAuth();
  const [selectedTab, setSelectedTab] = useState('bookings');

  const activeBookings = getActiveBookings();
  const pendingBookings = bookings.filter(b => b.status === BOOKING_STATUS.PENDING);

  const getStatusColor = (status) => {
    switch (status) {
      case BOOKING_STATUS.PENDING: return 'bg-yellow-100 text-yellow-800';
      case BOOKING_STATUS.CONFIRMED: return 'bg-green-100 text-green-800';
      case BOOKING_STATUS.CHECKED_IN: return 'bg-blue-100 text-blue-800';
      case BOOKING_STATUS.CHECKED_OUT: return 'bg-gray-100 text-gray-800';
      case BOOKING_STATUS.CANCELLED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConfirmBooking = (bookingId) => {
    updateBookingStatus(bookingId, BOOKING_STATUS.CONFIRMED);
  };

  const stats = [
    { label: 'Total Rooms', value: rooms.length, color: 'bg-blue-500' },
    { label: 'Available Rooms', value: rooms.filter(r => r.status === 'available').length, color: 'bg-green-500' },
    { label: 'Active Bookings', value: activeBookings.length, color: 'bg-purple-500' },
    { label: 'Pending Bookings', value: pendingBookings.length, color: 'bg-yellow-500' },
  ];

  if (!hasRole('receptionist') && !hasRole('manager')) {
    return <div className="p-8 text-center text-gray-600">Access denied</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Receptionist Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <span className="text-white text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setSelectedTab('bookings')}
            className={`px-4 py-2 font-medium ${selectedTab === 'bookings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setSelectedTab('pending')}
            className={`px-4 py-2 font-medium ${selectedTab === 'pending' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Pending ({pendingBookings.length})
          </button>
          <button
            onClick={() => setSelectedTab('active')}
            className={`px-4 py-2 font-medium ${selectedTab === 'active' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Active ({activeBookings.length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-out</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(selectedTab === 'bookings' ? bookings : 
              selectedTab === 'pending' ? pendingBookings : 
              activeBookings).map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                  <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  Room {booking.roomId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  TZS {booking.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  {booking.status === BOOKING_STATUS.PENDING && (
                    <button
                      onClick={() => handleConfirmBooking(booking.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Confirm
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
