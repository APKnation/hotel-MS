'use client';

import { useState } from 'react';
import { useBookings } from '../lib/context/BookingContext';
import { useAuth } from '../lib/context/AuthContext';

const PAYMENT_PROVIDERS = {
  TIGO: 'tigo',
  AIRTEL: 'airtel',
  HALOTEL: 'halotel'
};

export default function PaymentSystem() {
  const { bookings } = useBookings();
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    provider: PAYMENT_PROVIDERS.TIGO,
    phoneNumber: '',
    amount: ''
  });
  const [processing, setProcessing] = useState(false);

  const unpaidBookings = bookings.filter(b => b.paymentStatus === 'unpaid' && b.status !== 'cancelled');

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      alert(`Payment of TZS ${Number(formData.amount).toLocaleString()} processed successfully via ${formData.provider.toUpperCase()}!`);
      setProcessing(false);
      setSelectedBooking(null);
      setFormData({ provider: PAYMENT_PROVIDERS.TIGO, phoneNumber: '', amount: '' });
    }, 2000);
  };

  const getProviderColor = (provider) => {
    switch (provider) {
      case PAYMENT_PROVIDERS.TIGO: return 'bg-blue-600';
      case PAYMENT_PROVIDERS.AIRTEL: return 'bg-red-600';
      case PAYMENT_PROVIDERS.HALOTEL: return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mobile Money Payment</h1>

      {!selectedBooking ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Select Booking to Pay</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {unpaidBookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                    <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    Room {booking.roomId}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    TZS {booking.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      UNPAID
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setFormData({ ...formData, amount: booking.totalAmount });
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Pay Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {unpaidBookings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No unpaid bookings found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedBooking(null)}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to bookings
          </button>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Booking ID: <span className="font-semibold">{selectedBooking.id}</span></p>
              <p className="text-sm text-gray-600">Guest: <span className="font-semibold">{selectedBooking.guestName}</span></p>
              <p className="text-sm text-gray-600">Room: <span className="font-semibold">{selectedBooking.roomId}</span></p>
              <p className="text-lg font-bold text-gray-800 mt-2">
                Amount: TZS {selectedBooking.totalAmount.toLocaleString()}
              </p>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Provider</label>
                <div className="grid grid-cols-3 gap-4">
                  {Object.values(PAYMENT_PROVIDERS).map(provider => (
                    <button
                      key={provider}
                      type="button"
                      onClick={() => setFormData({ ...formData, provider })}
                      className={`p-4 rounded-lg border-2 ${
                        formData.provider === provider 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 ${getProviderColor(provider)} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                        <span className="text-white font-bold text-xs">{provider.toUpperCase()}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{provider.toUpperCase()}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+255 123 456 789"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (TZS)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
              >
                {processing ? 'Processing Payment...' : `Pay TZS ${Number(formData.amount).toLocaleString()}`}
              </button>
            </form>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is a demo payment system. In production, integrate with actual mobile money APIs (Tigo Pesa, Airtel Money, Halotel).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
