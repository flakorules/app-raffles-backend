const RaffleList = require("../models/RaffleList.model");
const Raffle = require("../models/Raffle.model");

const raffleListIdValidator = async (value, { req }) => {  
  
  const raffleList = await RaffleList.findById(value);  

  if (!raffleList) {
    throw new Error("raffleListId does not exist in DB");
  } else {
    const raffle = await Raffle.findById(raffleList.raffleId);
    
    if (raffle.userId.toString() !== req.uid) {
      throw new Error(
        "raffleListId is associated to a Raffle that was not created by de user"
      );
    }
  }

  return true;
};

module.exports = { raffleListIdValidator };
