import ticketsModel from "../../../schemas/ticketsModel.js";

export default class TicketsDAO {
  async getTickets() {
    const tickets = await ticketsModel.find().lean();
    return tickets;
  }

  async getTicketById(id) {
    const ticket = await ticketsModel.findOne({ _id: id });
    return ticket;
  }

  async createTicket(payload) {
    const createdTicket = await ticketsModel.create(payload);
    return createdTicket;
  }

  async updateTicket(id, payload) {
    const updatedTicket = await ticketsModel.updateOne(
      { _id: id },
      { $set: payload }
    );
    return updatedTicket;
  }
}

