'use client';

import { useState } from 'react';
import { useBookings } from '../lib/context/BookingContext';
import { useRooms } from '../lib/context/RoomContext';
import { useRoomKeys } from '../lib/context/RoomKeyContext';
import { useAuth } from '../lib/context/AuthContext';
import { BOOKING_STATUS } from '../lib/models/RoomBooking';
import { ROOM_STATUS } from '../lib/models/Room';

export default function CheckInOut() {
  const { bookings, updateBookingStatus } = useBookings();
  const { rooms, updateRoomStatus } = useRooms();
  const { assignKey, returnKey, getActiveKey } = useRoomKeys();
  const { hasRole } = useAuth();
  const [selectedTab, setSelectedTab] = useState('checkin');

  const confirmedBookings = bookings.filter(b => b.status === BOOKING_STATUS.CONFIRMED);
  const checkedInBookings = bookings.filter(b => b.status === BOOKING_STATUS.CHECKED_IN);

  const handleCheckIn = (booking) => {
    if (confirm(`Check in guest ${booking.guestName} for room ${booking.roomId}?`)) {
      updateBookingStatus(booking.id, BOOKING_STATUS.CHECKED_IN);
      updateRoomStatus(booking.roomId, ROOM_STATUS.OCCUPIED);
      assignKey(booking.roomId, booking.id);
      alert(`Guest checked in successfully! Key assigned.`);
    }
  };

  const handleCheckOut = (booking) => {
    const activeKey = getActiveKey(booking.id);
    if (activeKey) {
      returnKey(activeKey.id);
    }
    
    if (confirm(`Check out guest ${booking.guestName} from room ${booking.roomId}?`)) {
      updateBookingStatus(booking.id, BOOKING_STATUS.CHECKED_OUT);
      updateRoomStatus(booking.roomId, ROOM_STATUS.CLEANING);
      alert(`Guest checked out successfully! Room marked for cleaning.`);
    }
  };

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

  if (!hasRole('receptionist') && !hasRole('manager')) {
    return <div className="p-8 text-center text-gray-600">Access denied</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Check-in / Check-out</h1>

      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setSelectedTab('checkin')}
            className={`px-4 py-2 font-medium ${selectedTab === 'checkin' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Check-in ({confirmedBookings.length})
          </button>
          <button
            onClick={() => setSelectedTab('checkout')}
            className={`px-4 py-2 font-medium ${selectedTab === 'checkout' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Check-out ({checkedInBookings.length})
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
            {(selectedTab === 'checkin' ? confirmedBookings : checkedInBookings).map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                  <div className="text-sm text-gray-500">{booking.guestPhone}</div>
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
                <td className="px-6 py-4 text-sm font-medium">
                  {selectedTab === 'checkin' ? (
                    <button
                      onClick={() => handleCheckIn(booking)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Check In
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCheckOut(booking)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Check Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(selectedTab === 'checkin' && confirmedBookings.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl">No bookings pending check-in</p>
        </div>
      )}

      {(selectedTab === 'checkout' && checkedInBookings.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl">No guests currently checked in</p>
        </div>
      )}
    </div>
  );
}
