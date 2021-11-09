const { Router } = require("express");
const {
  getPrizesByAlias,
  addPrizeToRaffle,
  updatePrize,
  deletePrize,
} = require("../controllers/Prize.controller");
const router = Router();
const { check, param } = require("express-validator");

const { validateRequest } = require("../middlewares/validateRequest");

const { validateJWT } = require("../middlewares/validateJWT");

const { prizeIdValidator } = require("../middlewares/prizeValidator");

router.get("/:alias", getPrizesByAlias);
router.post(
  "/new/:raffleId",
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
    validateRequest,
  ],
  addPrizeToRaffle
);
router.put(
  "/update/:prizeId",
  [
    validateJWT,
    param("prizeId").custom(prizeIdValidator),
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
    validateRequest,
  ],
  updatePrize
);
router.delete(
  "/delete/:prizeId",
  [validateJWT, param("prizeId").custom(prizeIdValidator), validateRequest],
  deletePrize
);

module.exports = router;
