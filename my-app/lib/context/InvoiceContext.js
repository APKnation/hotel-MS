'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Invoice, INVOICE_STATUS } from '../models/Invoice';
import { RoomCharge, CHARGE_TYPE } from '../models/RoomCharge';

const InvoiceContext = createContext(null);

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const storedInvoices = localStorage.getItem('hotelInvoices');
    if (storedInvoices) {
      const parsedInvoices = JSON.parse(storedInvoices);
      setInvoices(parsedInvoices.map(i => {
        const invoice = Object.assign(new Invoice(), i);
        invoice.createdAt = new Date(i.createdAt);
        invoice.dueDate = new Date(i.dueDate);
        if (i.paidAt) invoice.paidAt = new Date(i.paidAt);
        invoice.charges = i.charges.map(c => Object.assign(new RoomCharge(), c));
        return invoice;
      }));
    } else {
      setInvoices([]);
    }
  }, []);

  const saveInvoices = (newInvoices) => {
    setInvoices(newInvoices);
    localStorage.setItem('hotelInvoices', JSON.stringify(newInvoices));
  };

  const createInvoice = (bookingId, guestName, charges) => {
    const newInvoice = new Invoice(
      Date.now().toString(),
      bookingId,
      guestName,
      charges
    );
    newInvoice.dueDate = new Date();
    newInvoice.dueDate.setDate(newInvoice.dueDate.getDate() + 7);
    newInvoice.calculateTotals();
    const newInvoices = [...invoices, newInvoice];
    saveInvoices(newInvoices);
    return newInvoice;
  };

  const addCharge = (invoiceId, charge) => {
    const newInvoices = invoices.map(invoice => {
      if (invoice.id === invoiceId) {
        const newCharges = [...invoice.charges, charge];
        const updatedInvoice = { ...invoice, charges: newCharges };
        updatedInvoice.calculateTotals();
        return updatedInvoice;
      }
      return invoice;
    });
    saveInvoices(newInvoices);
  };

  const markInvoicePaid = (id) => {
    const newInvoices = invoices.map(invoice => 
      invoice.id === id ? { ...invoice, status: INVOICE_STATUS.PAID, paidAt: new Date() } : invoice
    );
    saveInvoices(newInvoices);
  };

  const getInvoicesByBooking = (bookingId) => {
    return invoices.filter(invoice => invoice.bookingId === bookingId);
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      createInvoice,
      addCharge,
      markInvoicePaid,
      getInvoicesByBooking
    }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within InvoiceProvider');
  }
  return context;
}
