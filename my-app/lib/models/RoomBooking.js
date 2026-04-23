export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  CANCELLED: 'cancelled'
};

export class RoomBooking {
  constructor(id, roomId, guestName, guestEmail, guestPhone, checkInDate, checkOutDate, guestsCount) {
    this.id = id;
    this.roomId = roomId;
    this.guestName = guestName;
    this.guestEmail = guestEmail;
    this.guestPhone = guestPhone;
    this.checkInDate = new Date(checkInDate);
    this.checkOutDate = new Date(checkOutDate);
    this.guestsCount = guestsCount;
    this.status = BOOKING_STATUS.PENDING;
    this.createdAt = new Date();
    this.totalAmount = 0;
    this.paymentMethod = null;
    this.paymentStatus = 'unpaid';
  }

  calculateTotal(pricePerNight) {
    const nights = Math.ceil((this.checkOutDate - this.checkInDate) / (1000 * 60 * 60 * 24));
    this.totalAmount = nights * pricePerNight;
    return this.totalAmount;
  }

  cancel() {
    this.status = BOOKING_STATUS.CANCELLED;
    this.cancelledAt = new Date();
  }
}
