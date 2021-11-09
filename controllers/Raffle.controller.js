const { response } = require("express");
const User = require("../models/User.model");
const Raffle = require("../models/Raffle.model");
const Prize = require("../models/Prize.model");
const Ticket = require("../models/Ticket.model");
const RaffleList = require("../models/RaffleList.model");

const createRaffle = async (req, res = response) => {
  try {
    let raffle = new Raffle(req.body);
    raffle.userId = req.uid;
    raffle.status = 2; //assigned
    raffle.creationDate = Date.now();
    raffle.updateDate = Date.now();

    await raffle.save();

    let { alias, type, listQuantity, ticketsPerList, prizes } = req.body;
    prizes = prizes.map((prize) => ({ ...prize, raffleId: raffle.id }));

    await Prize.insertMany(prizes);

    let tickets = [];
    let raffleLists = [];
    console.log(type);

    if (type === "simple") {
      for (let i = 1; i <= ticketsPerList; i++) {
        tickets = [
          ...tickets,
          {
            raffleId: raffle.id,
            raffleListId: null,
            userId: null,
            code: `${alias}-${i}`,
            sequenceNumber: i,
            name: null,
            email: null,
            phoneNumber: null,
            status: 1,
            creationDate: Date.now(),
            updateDate: Date.now(),
          },
        ];
      }

      await Ticket.insertMany(tickets);
    } else if (type === "colaborative") {
      for (let i = 1; i <= listQuantity; i++) {
        raffleLists = [
          ...raffleLists,
          {
            raffleId: raffle.id,
            userId: null,
            listNumber: i,
            status: 1,
            creationDate: Date.now(),
            updateDate: Date.now(),
          },
        ];
      }

      await RaffleList.insertMany(raffleLists, async (error, docs) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            msg: "Error: Raffle.controller -> createRaffle",
          });
        }

        docs.forEach((list) => {
          for (let i = 1; i <= ticketsPerList; i++) {
            tickets = [
              ...tickets,
              {
                raffleId: raffle.id,
                raffleListId: list.id,
                userId: null,
                code: `${alias}-${list.listNumber}-${i}`,
                sequenceNumber: i,
                name: null,
                email: null,
                phoneNumber: null,
                status: 1,
                creationDate: Date.now(),
                updateDate: Date.now(),
              },
            ];
          }
        });
        await Ticket.insertMany(tickets);
      });
    } else {
      return res.status(500).json({
        ok: false,
        msg: "Error: Raffle.controller -> createRaffle",
      });
    }

    res.status(201).json({
      ok: true,
      msg: "Raffle.controller -> createRaffle",
      id: raffle.id,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Raffle.controller -> createRaffle",
      error,
    });
  }
};

const updateRaffle = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { title, description, drawDate } = req.body;

    let raffle = await Raffle.findById(id);

    raffle = await Raffle.findByIdAndUpdate(
      id,
      {
        ...raffle._doc,
        title: title,
        description: description,
        drawDate: drawDate,
        updateDate: Date.now(),
      },
      { new: true }
    );

    res.status(201).json({
      ok: true,
      msg: "Raffle.controller -> updateRaffle",
      raffle,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Raffle.controller -> updateRaffle",
    });
  }
};

const addTicketsToSimpleRaffle = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { ticketsPerList } = req.body;
    let newTickets = [];
    const raffle = await Raffle.findById(id);

    for (
      let i = raffle.ticketsPerList + 1;
      i <= raffle.ticketsPerList + Number(ticketsPerList);
      i++
    ) {
      newTickets = [
        ...newTickets,
        {
          raffleId: raffle.id,
          raffleListId: null,
          userId: null,
          code: `${raffle.alias}-${i}`,
          sequenceNumber: i,
          name: null,
          email: null,
          phoneNumber: null,
          status: 1,
          creationDate: Date.now(),
          updateDate: Date.now(),
        },
      ];
    }

    await Ticket.insertMany(newTickets);

    raffle.ticketsPerList = raffle.ticketsPerList + Number(ticketsPerList);
    await raffle.save();

    res.status(201).json({
      ok: true,
      msg: "Raffle.controller -> addTicketsToSimpleRaffle",
      raffle,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Raffle.controller -> addTicketsToSimpleRaffle",
    });
  }
};

const addListsToColaborativeRaffle = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { listQuantity } = req.body;
    let newLists = [];
    let newTickets = [];

    const raffle = await Raffle.findById(id);

    for (
      let i = raffle.listQuantity + 1;
      i <= raffle.listQuantity + Number(listQuantity);
      i++
    ) {
      newLists = [
        ...newLists,
        {
          raffleId: raffle.id,
          userId: null,
          listNumber: i,
          status: 1,
          creationDate: Date.now(),
          updateDate: Date.now(),
        },
      ];
    }

    let raffleLists = await RaffleList.insertMany(
      newLists,
      async (error, docs) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            msg: "Error: Raffle.controller -> addListsToColaborativeRaffle",
          });
        }
   

        docs.forEach((list) => {
          for (let i = 1; i <= raffle.ticketsPerList; i++) {
            newTickets = [
              ...newTickets,
              {
                raffleId: raffle.id,
                raffleListId: list.id,
                userId: null,
                code: `${raffle.alias}-${list.listNumber}-${i}`,
                sequenceNumber: i,
                name: null,
                email: null,
                phoneNumber: null,
                status: 1,
                creationDate: Date.now(),
                updateDate: Date.now(),
              },
            ];
          }
        });

        await Ticket.insertMany(newTickets);

        raffle.listQuantity = raffle.listQuantity + Number(listQuantity);
        await raffle.save();
        res.status(201).json({
          ok: true,
          msg: "Raffle.controller -> addListsToColaborativeRaffle",
          raffle,
          raffleLists: docs,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Raffle.controller -> addListsToColaborativeRaffle",
    });
  }
};

const getRaffleByAlias = async (req, res = response) => {
  try {
    const { alias } = req.params;
    const raffle = await Raffle.findOne({ alias });

    // let tickets = [];
    // let raffleLists = [];

    if (!raffle) {
      res.status(500).json({
        ok: false,
        msg: "There is no raffle by that alias",
      });
    }

    return res.status(201).json({
      ok: true,
      msg: "Raffle.controller -> getRaffleByAlias",
      raffle,
    });

    // if (raffle.type === "simple") {
    //   tickets = await Ticket.find({ raffleId: raffle.id });

    //   return res.status(201).json({
    //     ok: true,
    //     msg: "Raffle.controller -> getRaffleByAlias",
    //     raffle: {
    //       ...raffle._doc,
    //       //tickets,
    //     },
    //   });
    // } else if (raffle.type === "colaborative") {
    //   raffleLists = await RaffleList.find({ raffleId: raffle.id });

    //   return res.status(201).json({
    //     ok: true,
    //     msg: "Raffle.controller -> getRaffleByAlias",
    //     raffle: {
    //       ...raffle._doc,
    //       //raffleLists,
    //     },
    //   });
    // }
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Raffle.controller -> getRaffleByAlias",
    });
  }
};

const getRafflesByOwner = async (req, res = response) => {
  try {
    const { userName } = req.params;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(500).json({
        ok: false,
        msg: "Error: Raffle.controller -> getRafflesByOwner",
      });
    }

    const raffles = await Raffle.find({ userId: user.id });

    if (!raffles) {
      return res.status(500).json({
        ok: false,
        msg: "Error: Raffle.controller -> getRafflesByOwner",
      });
    }

    res.status(201).json({
      ok: true,
      msg: "Raffle.controller -> getRafflesByOwner",
      raffles,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Raffle.controller -> getRafflesByOwner",
    });
  }
};

const getRafflesByCollaboration = async (req, res = response) => {
  try {
    const { userName } = req.params;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(500).json({
        ok: false,
        msg: "Error: Raffle.controller -> getRafflesByCollaboration",
      });
    }

    const raffleListsByUser = await RaffleList.find({ userId: user._id });

    const raffleListIds = raffleListsByUser.reduce((acc, cur) => {
      if (acc.includes(cur._doc.raffleId.toString())) {
        return acc;
      } else {
        return [...acc, cur._doc.raffleId.toString()];
      }
    }, []);

    if (raffleListIds.length == 0) {
      return res.status(500).json({
        ok: false,
        msg: "Error: Raffle.controller -> getRafflesByCollaboration",
      });
    }

    let raffles = await Raffle.find({ _id: { $in: raffleListIds } });

    raffles = raffles.map((raffle) => ({
      ...raffle._doc,
      lists: raffleListsByUser.filter(
        (raffleList) => raffleList.raffleId.toString() === raffle.id.toString()
      ),
    }));

    res.status(201).json({
      ok: true,
      msg: "Raffle.controller -> getRafflesByCollaboration",
      raffles,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: Raffle.controller -> getRafflesByCollaboration",
    });
  }
};

module.exports = {
  createRaffle,
  updateRaffle,
  addTicketsToSimpleRaffle,
  addListsToColaborativeRaffle,
  getRaffleByAlias,
  getRafflesByOwner,
  getRafflesByCollaboration,
};
