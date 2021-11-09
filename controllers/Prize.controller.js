const { response } = require("express");
const Raffle = require("../models/Raffle.model");
const Prize = require("../models/Prize.model");

const getPrizesByAlias = async (req, res = response) => {
  try {
    const { alias } = req.params;

    const raffle = await Raffle.findOne({ alias }).exec();

    if (!raffle) {
      res.status(500).json({
        ok: false,
        msg: "There is no raffle by that alias",
      });
    }

    const prizes = await Prize.find({ raffleId: raffle._id });

    return res.status(201).json({
      ok: true,
      msg: "Raffle.controller -> getPrizesByAlias",
      prizes,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Prize.controller -> getPrizesByAlias",
      error,
    });
  }
};

const updatePrize = async (req, res = response) => {
  try {
    const { prizeId } = req.params;
    const { title, description } = req.body;

    Prize.findByIdAndUpdate();

    const prize = await Prize.findByIdAndUpdate(
      prizeId ,
      {
        title: title,
        description: description,
      },
      { new: true }
    );

    res.status(201).json({
      ok: true,
      msg: " Prize.controler -> updatePrize",
      prize,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Prize.controler -> updatePrize",
      error,
    });
  }
};

const addPrizeToRaffle = async (req, res = response) => {
  try {
    const { raffleId } = req.params;
    const { title, description } = req.body;

    const prize = new Prize({
      title,
      description,
      raffleId,
    });

    await prize.save();

    return res.status(201).json({
      ok: true,
      msg: "Raffle.controller -> addPrizeToRaffle",
      prize,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Prize.controller -> addPrizeToRaffle",
      error,
    });
  }
};

const deletePrize = async (req, res = response) => {
  try {
    const { prizeId } = req.params;

    const prize = await Prize.findByIdAndDelete(prizeId);

    return res.status(201).json({
      ok: true,
      msg: "Raffle.controller -> deletePrize",
      prizeId: prize._id,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Prize.controller -> deletePrize",
      error,
    });
  }
};

module.exports = {
  getPrizesByAlias,
  addPrizeToRaffle,
  updatePrize,
  deletePrize,
};
