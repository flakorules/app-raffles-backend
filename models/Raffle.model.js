const { Schema, model } = require("mongoose");

const RaffleSchema = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  alias: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  listQuantity: {
    type: Number,
    required: true,
  },
  ticketsPerList: {
    type: Number,
    required: true,
  },
  pricePerTicket: {
    type: Number,
    required: true,
  },
  drawDate: {
    type: Date,
    required: true,
  },
  /*
  1. created
  2. assigned
  3. finished
  4. deleted
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

module.exports = model("Raffle", RaffleSchema);
