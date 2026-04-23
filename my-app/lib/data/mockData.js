import { User, USER_ROLE } from '../models/User';
import { Room, ROOM_TYPES, ROOM_STATUS } from '../models/Room';
import { RoomBooking, BOOKING_STATUS } from '../models/RoomBooking';

export const mockUsers = [
  new User('1', 'John Manager', 'manager@hotel.com', '+255123456789', USER_ROLE.MANAGER),
  new User('2', 'Sarah Reception', 'reception@hotel.com', '+255123456790', USER_ROLE.RECEPTIONIST),
  new User('3', 'Mike Housekeeper', 'housekeeper@hotel.com', '+255123456791', USER_ROLE.HOUSEKEEPER),
  new User('4', 'Guest User', 'guest@hotel.com', '+255123456792', USER_ROLE.GUEST),
];

export const mockRooms = [
  new Room('1', 101, ROOM_TYPES.STANDARD, 50000, 2, ['WiFi', 'TV', 'AC']),
  new Room('2', 102, ROOM_TYPES.STANDARD, 50000, 2, ['WiFi', 'TV', 'AC']),
  new Room('3', 103, ROOM_TYPES.STANDARD, 50000, 2, ['WiFi', 'TV', 'AC']),
  new Room('4', 201, ROOM_TYPES.DELUXE, 80000, 2, ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony']),
  new Room('5', 202, ROOM_TYPES.DELUXE, 80000, 2, ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony']),
  new Room('6', 301, ROOM_TYPES.FAMILY, 120000, 4, ['WiFi', 'TV', 'AC', 'Kitchen', '2 Bedrooms']),
  new Room('7', 302, ROOM_TYPES.FAMILY, 120000, 4, ['WiFi', 'TV', 'AC', 'Kitchen', '2 Bedrooms']),
  new Room('8', 401, ROOM_TYPES.BUSINESS_SUITE, 200000, 2, ['WiFi', 'TV', 'AC', 'Office', 'Meeting Room', 'Mini Bar']),
  new Room('9', 402, ROOM_TYPES.BUSINESS_SUITE, 200000, 2, ['WiFi', 'TV', 'AC', 'Office', 'Meeting Room', 'Mini Bar']),
  new Room('10', 501, ROOM_TYPES.BUSINESS_SUITE, 250000, 3, ['WiFi', 'TV', 'AC', 'Office', 'Meeting Room', 'Mini Bar', 'Living Room']),
];

export const mockBookings = [
  new RoomBooking('1', '1', 'Alice Smith', 'alice@email.com', '+255123456789', 
    new Date('2026-04-20'), new Date('2026-04-25'), 2),
];

mockBookings[0].status = BOOKING_STATUS.CONFIRMED;
mockBookings[0].calculateTotal(80000);
