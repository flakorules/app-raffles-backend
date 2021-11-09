const { response } = require("express");
const Raffle = require("../models/Raffle.model");
const User = require("../models/User.model");

const RaffleList = require("../models/RaffleList.model");

const getListsByAlias = async (req, res = response) => {
  const { alias } = req.params;
  const raffle = await Raffle.findOne({ alias }).exec();

  if (!raffle) {
    res.status(500).json({
      ok: false,
      msg: "Error: Raffle.controller -> createRaffle",
      error,
    });
  }

  if (raffle.type === "colaborative") {
    const rafleLists = await RaffleList.find({ raffleId: raffle._id }).populate(
      "userId",
      "-password"
    );

    return res.status(201).json({
      ok: true,
      msg: "RaffleList.controller -> getListsByAlias",
      rafleLists,
    });
  } else {
    res.status(500).json({
      ok: false,
      msg: "Error: RaffleList.controller -> createRaffle",
      error,
    });
  }

  try {
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: RaffleList.controller -> createRaffle",
      error,
    });
  }
};

const assignListToUser = async (req, res = response) => {
  try {
    const { raffleListId } = req.params;
    const { userName } = req.body;

    const user = await User.findOne({ userName });

    if (!user) {
      res.status(500).json({
        ok: false,
        msg: "Error: RaffleList.controller -> assignList",
      });
    }

    const raffleList = await RaffleList.findByIdAndUpdate(
      raffleListId,
      { userId: user._id, status: 2, updateDate: Date.now() },
      { new: true }
    ).populate("userId", "-password");

    res.status(201).json({
      ok: true,
      msg: "RaffleList.controller -> assignListToUser",
      raffleList,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: RaffleList.controller -> assignList",
      error,
    });
  }
};

const getListByAliasAndListNumber = async (req, res = response) => {
  try {
    const { alias, listNumber } = req.params;

    
    const raffle = await Raffle.findOne({ alias });    

    if (!raffle) {
      res.status(500).json({
        ok: false,
        msg:
          "Error: RaffleList.controller -> getListByAliasAndListNumber (!raffle)",
      });
    }

    const raffleList = await RaffleList.findOne({
      raffleId: raffle._id,
      listNumber,
    });

    if (!raffleList) {
      res.status(500).json({
        ok: false,
        msg:
          "Error: RaffleList.controller -> getListByAliasAndListNumber (!raffleList)",
      });
    }

    res.status(201).json({
      ok: true,
      msg: "RaffleList.controller -> getListByAliasAndListNumber",
      raffleList,
    });


  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: RaffleList.controller -> getListByAliasAndListNumber",
      error,
    });
  }
};

module.exports = { getListsByAlias, assignListToUser, getListByAliasAndListNumber };
