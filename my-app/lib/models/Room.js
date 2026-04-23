export const ROOM_TYPES = {
  STANDARD: 'standard',
  DELUXE: 'deluxe',
  FAMILY: 'family',
  BUSINESS_SUITE: 'business_suite'
};

export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  CLEANING: 'cleaning'
};

export class Room {
  constructor(id, number, type, pricePerNight, capacity, amenities = []) {
    this.id = id;
    this.number = number;
    this.type = type;
    this.pricePerNight = pricePerNight;
    this.capacity = capacity;
    this.amenities = amenities;
    this.status = ROOM_STATUS.AVAILABLE;
    this.floor = Math.floor(number / 100);
  }

  isAvailable() {
    return this.status === ROOM_STATUS.AVAILABLE;
  }
}
