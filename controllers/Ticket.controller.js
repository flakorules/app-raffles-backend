const { response } = require("express");
const Raffle = require("../models/Raffle.model");
const RaffleList = require("../models/RaffleList.model");
const Ticket = require("../models/Ticket.model");

const getTicketsFromRaffleList = async (req, res = response) => {
  try {
    const { alias, listNumber } = req.params;

    const raffle = await Raffle.findOne({ alias });

    if (!raffle) {
      res.status(500).json({
        ok: false,
        msg: "Error: Ticket.controller -> getTicketsFromRaffleList",
      });
    }

    if (raffle.type !== "colaborative") {
      res.status(500).json({
        ok: false,
        msg: "Error: Ticket.controller -> getTicketsFromRaffleList",
      });
    }

    const raffleList = await RaffleList.findOne({
      raffleId: raffle._id,
      listNumber,
    });

    if (!raffleList) {
      res.status(500).json({
        ok: false,
        msg: "Error: Ticket.controller -> getTicketsFromRaffleList",
      });
    }

    const tickets = await Ticket.find({
      raffleListId: raffleList._id,
    }).populate("raffleId");

    res.status(201).json({
      ok: true,
      msg: "Ticket.controller -> getTicketsFromRaffleList",
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Ticket.controller -> getTicketsFromRaffleList",
      error,
    });
  }
};

const geTicketsFromRaffle = async (req, res = response) => {
  try {
    const { alias } = req.params;

    const raffle = await Raffle.findOne({ alias });

    if (!raffle) {
      res.status(500).json({
        ok: false,
        msg: "Error: Ticket.controller -> geTicketsFromRaffle",
      });
    }

    if (raffle.type !== "simple") {
      res.status(500).json({
        ok: false,
        msg: "Error: Ticket.controller -> geTicketsFromRaffle",
      });
    }

    const tickets = await Ticket.find({ raffleId: raffle._id }).populate(
      "raffleId"
    );

    res.status(201).json({
      ok: true,
      msg: "Ticket.controller -> geTicketsFromRaffle",
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Ticket.controller -> geTicketsFromRaffle",
      error,
    });
  }
};

const bookTicket = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { uid } = req;

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status: 2, updateDate: Date.now(), userId: uid },
      { new: true }
    ).populate("raffleId");

    res.status(201).json({
      ok: true,
      msg: "Ticket.controller -> bookTicket",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Ticket.controller -> bookTicket",
      error,
    });
  }
};

const unbookTicket = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { uid } = req;

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status: 1, updateDate: Date.now(), userId: null },
      { new: true }
    ).populate("raffleId");

    res.status(201).json({
      ok: true,
      msg: "Ticket.controller -> bookTicket",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Ticket.controller -> bookTicket",
      error,
    });
  }
};

const unbookNoBoughtTickets = async (req, res = response) => {
  try {
    
    
    const result = await Ticket.updateMany(
      { status: 2 },
      { userId: null, status: 1, updateDate: Date.now() }
    );

    res.status(201).json({
      ok: true,
      msg: "Ticket.controller -> unbookNoBoughtTickets",
      result,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Ticket.controller -> unbookNoBoughtTickets",
      error,
    });
  }
};

module.exports = {
  getTicketsFromRaffleList,
  geTicketsFromRaffle,
  bookTicket,
  unbookTicket,
  unbookNoBoughtTickets,
};
