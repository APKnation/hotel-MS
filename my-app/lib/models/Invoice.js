export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

export class Invoice {
  constructor(id, bookingId, guestName, charges = []) {
    this.id = id;
    this.bookingId = bookingId;
    this.guestName = guestName;
    this.charges = charges;
    this.status = INVOICE_STATUS.DRAFT;
    this.createdAt = new Date();
    this.dueDate = new Date();
    this.paidAt = null;
    this.subtotal = 0;
    this.tax = 0;
    this.total = 0;
  }

  calculateTotals(taxRate = 0.18) {
    this.subtotal = this.charges.reduce((sum, charge) => sum + charge.amount, 0);
    this.tax = this.subtotal * taxRate;
    this.total = this.subtotal + this.tax;
  }

  markPaid() {
    this.status = INVOICE_STATUS.PAID;
    this.paidAt = new Date();
  }
}
