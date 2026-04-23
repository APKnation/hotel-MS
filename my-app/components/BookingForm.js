'use client';

import { useState } from 'react';
import { useBookings } from '../lib/context/BookingContext';

export default function BookingForm({ room, onClose }) {
  const { createBooking } = useBookings();
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkInDate: '',
    checkOutDate: '',
    guestsCount: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const booking = createBooking({
      roomId: room.id,
      ...formData,
      pricePerNight: room.pricePerNight
    });

    alert('Booking created successfully! Total: TZS ' + booking.totalAmount.toLocaleString());
    onClose();
  };

  const calculateNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const start = new Date(formData.checkInDate);
      const end = new Date(formData.checkOutDate);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const nights = calculateNights();
  const total = nights * room.pricePerNight;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Book Room {room.number}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Room Type: <span className="font-semibold">{room.type}</span></p>
            <p className="text-sm text-gray-600">Price: <span className="font-semibold">TZS {room.pricePerNight.toLocaleString()}/night</span></p>
            <p className="text-sm text-gray-600">Capacity: <span className="font-semibold">{room.capacity} guests</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
              <input
                type="date"
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                min={today}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
              <input
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                min={formData.checkInDate || today}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
              <input
                type="number"
                value={formData.guestsCount}
                onChange={(e) => setFormData({ ...formData, guestsCount: e.target.value })}
                max={room.capacity}
                min="1"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {nights > 0 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Duration: <span className="font-semibold">{nights} night(s)</span></p>
                <p className="text-lg font-bold text-green-700">Total: TZS {total.toLocaleString()}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
