'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { RoomBooking, BOOKING_STATUS } from '../models/RoomBooking';
import { mockBookings } from '../data/mockData';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedBookings = localStorage.getItem('hotelBookings');
    if (storedBookings) {
      const parsedBookings = JSON.parse(storedBookings);
      setBookings(parsedBookings.map(b => {
        const booking = Object.assign(new RoomBooking(), b);
        booking.checkInDate = new Date(b.checkInDate);
        booking.checkOutDate = new Date(b.checkOutDate);
        booking.createdAt = new Date(b.createdAt);
        return booking;
      }));
    } else {
      setBookings(mockBookings);
      localStorage.setItem('hotelBookings', JSON.stringify(mockBookings));
    }
  }, []);

  const saveBookings = (newBookings) => {
    setBookings(newBookings);
    localStorage.setItem('hotelBookings', JSON.stringify(newBookings));
  };

  const createBooking = (bookingData) => {
    const newBooking = new RoomBooking(
      Date.now().toString(),
      bookingData.roomId,
      bookingData.guestName,
      bookingData.guestEmail,
      bookingData.guestPhone,
      bookingData.checkInDate,
      bookingData.checkOutDate,
      bookingData.guestsCount
    );
    newBooking.calculateTotal(bookingData.pricePerNight);
    const newBookings = [...bookings, newBooking];
    saveBookings(newBookings);
    return newBooking;
  };

  const updateBookingStatus = (id, status) => {
    const newBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status } : booking
    );
    saveBookings(newBookings);
  };

  const cancelBooking = (id) => {
    const newBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: BOOKING_STATUS.CANCELLED, cancelledAt: new Date() } : booking
    );
    saveBookings(newBookings);
  };

  const getBookingsByGuest = (guestEmail) => {
    return bookings.filter(booking => booking.guestEmail === guestEmail);
  };

  const getActiveBookings = () => {
    return bookings.filter(booking => 
      booking.status === BOOKING_STATUS.CONFIRMED || 
      booking.status === BOOKING_STATUS.CHECKED_IN
    );
  };

  const getBookingsByRoom = (roomId) => {
    return bookings.filter(booking => booking.roomId === roomId);
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      createBooking,
      updateBookingStatus,
      cancelBooking,
      getBookingsByGuest,
      getActiveBookings,
      getBookingsByRoom
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within BookingProvider');
  }
  return context;
}
