export const NOTIFICATION_TYPE = {
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_CANCELLED: 'booking_cancelled',
  CHECK_IN: 'check_in',
  CHECK_OUT: 'check_out',
  PAYMENT_RECEIVED: 'payment_received',
  ROOM_READY: 'room_ready',
  CLEANING_ASSIGNED: 'cleaning_assigned'
};

export class Notification {
  constructor(id, recipientId, type, message, relatedBookingId = null) {
    this.id = id;
    this.recipientId = recipientId;
    this.type = type;
    this.message = message;
    this.relatedBookingId = relatedBookingId;
    this.createdAt = new Date();
    this.isRead = false;
  }

  markAsRead() {
    this.isRead = true;
    this.readAt = new Date();
  }
}
