const { Schema, model } = require("mongoose");

const TicketSchema = {
  raffleId: {
    type: Schema.Types.ObjectId,
    ref: "Raffle",
    required: true,
  },
  raffleListId: {
    type: Schema.Types.ObjectId,
    ref: "RaffleList",
    required: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  sequenceNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  /*
  1. available
  2. booked
  3. sold
   */
  status: {
    type: Number,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  updateDate: {
    type: Date,
    required: true,
  },
};

module.exports = model("Ticket", TicketSchema);
