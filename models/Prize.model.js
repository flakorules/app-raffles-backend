const { Schema, model } = require("mongoose");

const PrizeSchema = {
  raffleId: {
    type: Schema.Types.ObjectId,
    ref: "Raffle",
    required: true,
  },

  ticketd: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
};

module.exports = model("Prize", PrizeSchema);
