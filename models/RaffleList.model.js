const { Schema, model } = require("mongoose");

const RaffleListSchema = {
  raffleId: {
    type: Schema.Types.ObjectId,
    ref: "Raffle",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  listNumber: {
    type: Number,
    required: true,
  },
  /*
  1. available
  2. assigned
  3. done
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
  tickets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Ticket"
    },
  ],
};

module.exports = model("RaffleList", RaffleListSchema);
