'use client';

import { useState } from 'react';
import { useInvoices } from '../lib/context/InvoiceContext';
import { useBookings } from '../lib/context/BookingContext';
import { useAuth } from '../lib/context/AuthContext';
import { RoomCharge, CHARGE_TYPE } from '../lib/models/RoomCharge';
import { INVOICE_STATUS } from '../lib/models/Invoice';

export default function InvoiceGenerator() {
  const { invoices, createInvoice, addCharge, markInvoicePaid } = useInvoices();
  const { bookings } = useBookings();
  const { hasRole } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showChargeForm, setShowChargeForm] = useState(false);
  const [chargeData, setChargeData] = useState({
    type: CHARGE_TYPE.SERVICE,
    description: '',
    amount: ''
  });

  const checkedOutBookings = bookings.filter(b => b.status === 'checked_out' && b.paymentStatus !== 'paid');

  const handleCreateInvoice = (booking) => {
    const roomCharge = new RoomCharge(
      Date.now().toString(),
      booking.id,
      CHARGE_TYPE.ROOM,
      `Room charges for ${booking.guestName}`,
      booking.totalAmount
    );
    
    const invoice = createInvoice(booking.id, booking.guestName, [roomCharge]);
    alert(`Invoice created for TZS ${invoice.total.toLocaleString()}`);
  };

  const handleAddCharge = (invoiceId) => {
    const charge = new RoomCharge(
      Date.now().toString(),
      selectedBooking.id,
      chargeData.type,
      chargeData.description,
      Number(chargeData.amount)
    );
    
    addCharge(invoiceId, charge);
    setChargeData({ type: CHARGE_TYPE.SERVICE, description: '', amount: '' });
    setShowChargeForm(false);
    alert('Charge added to invoice');
  };

  const handleMarkPaid = (invoiceId) => {
    if (confirm('Mark this invoice as paid?')) {
      markInvoicePaid(invoiceId);
      alert('Invoice marked as paid');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case INVOICE_STATUS.DRAFT: return 'bg-gray-100 text-gray-800';
      case INVOICE_STATUS.SENT: return 'bg-blue-100 text-blue-800';
      case INVOICE_STATUS.PAID: return 'bg-green-100 text-green-800';
      case INVOICE_STATUS.OVERDUE: return 'bg-red-100 text-red-800';
      case INVOICE_STATUS.CANCELLED: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!hasRole('receptionist') && !hasRole('manager')) {
    return <div className="p-8 text-center text-gray-600">Access denied</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Invoice Management</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Invoice for Checked-out Bookings</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {checkedOutBookings.map(booking => (
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
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => handleCreateInvoice(booking)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Create Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {checkedOutBookings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No checked-out bookings pending invoicing</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">All Invoices</h2>
        <div className="space-y-4">
          {invoices.map(invoice => (
            <div key={invoice.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Invoice #{invoice.id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-600">Guest: {invoice.guestName}</p>
                  <p className="text-sm text-gray-600">Booking ID: {invoice.bookingId}</p>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status.toUpperCase()}
                  </span>
                  {invoice.status !== INVOICE_STATUS.PAID && (
                    <button
                      onClick={() => handleMarkPaid(invoice.id)}
                      className="block mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-gray-800">Charges</h4>
                  {invoice.status !== INVOICE_STATUS.PAID && (
                    <button
                      onClick={() => { setSelectedBooking(bookings.find(b => b.id === invoice.bookingId)); setShowChargeForm(true); }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Charge
                    </button>
                  )}
                </div>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2">Description</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.charges.map((charge, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2">{charge.description}</td>
                        <td className="py-2 capitalize">{charge.type.replace('_', ' ')}</td>
                        <td className="py-2 text-right">TZS {charge.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>TZS {invoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (18%):</span>
                    <span>TZS {invoice.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>TZS {invoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {invoices.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">No invoices found</p>
          </div>
        )}
      </div>

      {showChargeForm && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Add Charge</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Charge Type</label>
                <select
                  value={chargeData.type}
                  onChange={(e) => setChargeData({ ...chargeData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value={CHARGE_TYPE.SERVICE}>Service</option>
                  <option value={CHARGE_TYPE.AMENITY}>Amenity</option>
                  <option value={CHARGE_TYPE.DAMAGE}>Damage</option>
                  <option value={CHARGE_TYPE.LATE_CHECKOUT}>Late Checkout</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={chargeData.description}
                  onChange={(e) => setChargeData({ ...chargeData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (TZS)</label>
                <input
                  type="number"
                  value={chargeData.amount}
                  onChange={(e) => setChargeData({ ...chargeData, amount: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    const invoice = invoices.find(i => i.bookingId === selectedBooking.id);
                    if (invoice) handleAddCharge(invoice.id);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Charge
                </button>
                <button
                  onClick={() => { setShowChargeForm(false); setChargeData({ type: CHARGE_TYPE.SERVICE, description: '', amount: '' }); }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
