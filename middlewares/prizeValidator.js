const Prize = require("../models/Prize.model");
const Raffle = require("../models/Raffle.model");

const prizeIdValidator = async (value, { req }) => {
  const prize = await Prize.findById(value); 

  if (!prize) {
    throw new Error("prizeId does not exist in DB");
  } else {
    const raffle = await Raffle.findById(prize.raffleId);

    console.log(raffle);
    console.log(req.uid);

    if (raffle.userId.toString() !== req.uid) {
        throw new Error("The associated raffle to this prize was not created by the authenticated user");
    }


  }

  return true;
};

module.exports = { prizeIdValidator };
