export class Hotel {
  constructor(id, name, address, phone, email) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.rooms = [];
    this.bookings = [];
    this.staff = [];
  }
}
