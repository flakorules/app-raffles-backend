const Ticket = require("../models/Ticket.model");

const ticketStatusValidator = async (value) => {
  const ticket = await Ticket.findById(value);

  if (ticket.status !== 1) {
    throw new Error("Ticket is already booked or sold");
  }

  return true;
};

const unbookTicketValidator = async (value) => {
  const ticket = await Ticket.findById(value);

  if (ticket.status === 1) {
    throw new Error("Ticket has already been unbooked");
  } else if (ticket.status === 3) {
    throw new Error("Ticket is already been sold");
  }

  return true;
};

const unbookTicketUidValidator = async (value, { req })=>{

  const ticket = await Ticket.findById(value);

  if(ticket.userId.toString() !== req.uid){

    throw new Error("The authenticated user is not assigned to this ticket");

  }

  return true;

}

module.exports = { ticketStatusValidator, unbookTicketValidator, unbookTicketUidValidator };
