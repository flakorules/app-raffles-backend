// api/raffles

const { Router } = require("express");
const router = Router();
const { check, param } = require("express-validator");

const {
  createRaffle,
  updateRaffle,
  addTicketsToSimpleRaffle,
  addListsToColaborativeRaffle,
  getRaffleByAlias,
  getRafflesByOwner,
  getRafflesByCollaboration,
} = require("../controllers/Raffle.controller");
const { validateJWT } = require("../middlewares/validateJWT");
const { validateRequest } = require("../middlewares/validateRequest");

const {
  aliasValidator,
  listQuantityValidator,
  raffleIdValidator,
  raffleTypeSimpleValidator,
  raffleTypeColaborativeValidator,
} = require("../middlewares/raffleValidator");

router.post(
  "/new",
  [
    validateJWT,
    check("title")
      .notEmpty()
      .withMessage("title is mandatory")
      .isLength({ min: 6 })
      .withMessage("title length should be at least 6"),
    check("description")
      .notEmpty()
      .withMessage("description is mandatory")
      .isLength({ min: 6 })
      .withMessage("description length should be at least 6"),
    check("alias")
      .notEmpty()
      .withMessage("alias is mandatory")
      .isLength({ min: 6 })
      .withMessage("alias length should be at least 6")
      .custom(aliasValidator),
    check("type")
      .notEmpty()
      .withMessage("type is mandatory")
      .isIn(["simple", "colaborative"])
      .withMessage("type should only be simple or colaborative"),
    check("listQuantity")
      .notEmpty()
      .withMessage("listQuantity is mandatory")
      .isInt()
      .withMessage("listQuantity should be a valid integer")
      .custom(listQuantityValidator),
    check("ticketsPerList")
      .notEmpty()
      .withMessage("ticketsPerList is mandatory")
      .isInt({ min: 5 })
      .withMessage("ticketsPerList should be a valid integer (min=5)"),
    check("pricePerTicket")
      .notEmpty()
      .withMessage("pricePerTicket is mandatory")
      .isNumeric()
      .withMessage("ticketsPerList should be a valid numeric"),
    check("drawDate")
      .notEmpty()
      .withMessage("drawDate is mandatory"),
      // .isDate()
      // .withMessage("drawDate should be a valida date"),
    validateRequest,
  ],
  createRaffle
);

router.get("/:alias", getRaffleByAlias);

router.get("/owner/:userName", getRafflesByOwner);

router.get("/collaboration/:userName", getRafflesByCollaboration);

router.put(
  "/update/:id",
  [
    validateJWT,
    param("id").custom(raffleIdValidator),
    check("title")
      .notEmpty()
      .withMessage("title is mandatory")
      .isLength({ min: 6 })
      .withMessage("title length should be at least 6"),
    check("description")
      .notEmpty()
      .withMessage("description is mandatory")
      .isLength({ min: 6 })
      .withMessage("description length should be at least 6"),
    check("drawDate")
      .notEmpty()
      .withMessage("drawDate is mandatory")
      .isDate()
      .withMessage("drawDate should be a valida date"),
    validateRequest,
  ],
  updateRaffle
);

router.put(
  "/simple/addTickets/:id",
  [
    validateJWT,
    param("id").custom(raffleIdValidator).custom(raffleTypeSimpleValidator),
    check("ticketsPerList")
      .notEmpty()
      .withMessage("ticketsPerList is mandatory")
      .isInt({ min: 1 })
      .withMessage("ticketsPerList should be a valid integer (min=1)"),
    validateRequest,
  ],
  addTicketsToSimpleRaffle
);

router.put(
  "/colaborative/addLists/:id",
  [
    validateJWT,
    param("id")
      .custom(raffleIdValidator)
      .custom(raffleTypeColaborativeValidator),
    check("listQuantity")
      .notEmpty()
      .withMessage("listQuantity is mandatory")
      .isInt({ min: 1 })
      .withMessage("listQuantity should be a valid integer (min=1)"),
    validateRequest,
  ],
  addListsToColaborativeRaffle
);

module.exports = router;
