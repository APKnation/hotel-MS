'use client';

import { useState, useEffect } from 'react';
import { useBookings } from '../lib/context/BookingContext';
import { useAuth } from '../lib/context/AuthContext';
import { BOOKING_STATUS } from '../lib/models/RoomBooking';

export default function GuestBookings() {
  const { bookings, cancelBooking } = useBookings();
  const { user } = useAuth();
  const [guestBookings, setGuestBookings] = useState([]);

  useEffect(() => {
    if (user) {
      setGuestBookings(bookings.filter(b => b.guestEmail === user.email));
    }
  }, [bookings, user]);

  const handleCancel = (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

      {guestBookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {guestBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Room {booking.roomId}
                  </h3>
                  <p className="text-gray-600">Guest: {booking.guestName}</p>
                  <p className="text-gray-600">Email: {booking.guestEmail}</p>
                  <p className="text-gray-600">Phone: {booking.guestPhone}</p>
                  <p className="text-gray-600">
                    Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">Guests: {booking.guestsCount}</p>
                  <p className="text-lg font-bold text-gray-800 mt-2">
                    Total: TZS {booking.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {booking.status === BOOKING_STATUS.CONFIRMED && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="block mt-4 text-red-600 hover:text-red-800 text-sm"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
