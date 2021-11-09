const Raffle = require("../models/Raffle.model");

const aliasValidator = async (value) => {
  const raffle = await Raffle.findOne({ alias: value });

  if (raffle) {
    throw new Error("Raffle alias already exists in DB");
  }
  return true;
};

const listQuantityValidator = (value, { req }) => {
  const { type } = req.body;

  

  if (type === "simple" && value !== "1") {
    throw new Error("listQuantity should only be 1 on simple raffles");
  } else if (type === "colaborative" && value === "1") {
    throw new Error(
      "listQuantity should be greater than one on colaborative raffles"
    );
  } else {
    return true;
  }
};

const raffleIdValidator = async (value, { req }) => {
  const raffle = await Raffle.findById(value);

  if (!raffle) {
    throw new Error("raffleId does not exist");
  } else {
    if (raffle.userId.toString() !== req.uid) {
      throw new Error(
        "raffleId was not created by the user who is trying to update it"
      );
    }
  }

  return true;
};

const raffleTypeSimpleValidator = async (value) => {
  const raffle = await Raffle.findById(value);

  if (!raffle) {
    throw new Error("raffleId does not exist");
  } else {
    if (raffle.type === "simple") {
      return true;
    } else {
      throw new Error("raffleId should be type : simple");
    }
  }
};

const raffleTypeColaborativeValidator = async (value) => {
  const raffle = await Raffle.findById(value);

  if (!raffle) {
    throw new Error("raffleId does not exist");
  } else {
    if (raffle.type === "colaborative") {
      return true;
    } else {
      throw new Error("raffleId should be type : colaborative");
    }
  }
};

module.exports = {
  aliasValidator,
  listQuantityValidator,
  raffleIdValidator,
  raffleTypeSimpleValidator,
  raffleTypeColaborativeValidator,
};
