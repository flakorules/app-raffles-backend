const { Router } = require("express");
const router = Router();
const { check, param } = require("express-validator");

const {
  geTicketsFromRaffle,
  getTicketsFromRaffleList,
  bookTicket,
  unbookTicket,unbookNoBoughtTickets
} = require("../controllers/Ticket.controller");
const {
  ticketStatusValidator,
  unbookTicketValidator,
  unbookTicketUidValidator,
} = require("../middlewares/ticketValidator");
const { validateJWT } = require("../middlewares/validateJWT");
const { validateRequest } = require("../middlewares/validateRequest");

router.get("/:alias", geTicketsFromRaffle);

router.get("/:alias/list/:listNumber", getTicketsFromRaffleList);

router.put("/nobought/unbook", unbookNoBoughtTickets);

router.put(
  "/book/:id",
  [validateJWT, param("id").custom(ticketStatusValidator), validateRequest],
  bookTicket
);
router.put(
  "/unbook/:id",
  [
    validateJWT,
    param("id").custom(unbookTicketUidValidator).custom(unbookTicketValidator),
    validateRequest,
  ],
  unbookTicket
);

module.exports = router;
