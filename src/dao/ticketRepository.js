import ticketModel from './models/ticketModel.js';

function generateTicketCode() {
  return `TICKET-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
}

class TicketRepository {
  async createTicket({ amount, purchaser, products }) {
    const code = generateTicketCode();
    const ticket = await ticketModel.create({ code, amount, purchaser, products });
    // Return a DTO-like plain object
    return {
      id: ticket._id.toString(),
      code: ticket.code,
      purchase_datetime: ticket.purchase_datetime,
      amount: ticket.amount,
      purchaser: ticket.purchaser,
      products: ticket.products
    };
  }
}

export { TicketRepository };