export const CHARGE_TYPE = {
  ROOM: 'room',
  SERVICE: 'service',
  AMENITY: 'amenity',
  DAMAGE: 'damage',
  LATE_CHECKOUT: 'late_checkout'
};

export class RoomCharge {
  constructor(id, bookingId, type, description, amount) {
    this.id = id;
    this.bookingId = bookingId;
    this.type = type;
    this.description = description;
    this.amount = amount;
    this.createdAt = new Date();
  }
}
