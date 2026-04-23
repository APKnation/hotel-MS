export class RoomKey {
  constructor(id, roomId, bookingId, assignedAt) {
    this.id = id;
    this.roomId = roomId;
    this.bookingId = bookingId;
    this.assignedAt = assignedAt || new Date();
    this.returnedAt = null;
    this.isActive = true;
    this.keyCode = this.generateKeyCode();
  }

  generateKeyCode() {
    return 'KEY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  returnKey() {
    this.returnedAt = new Date();
    this.isActive = false;
  }
}
