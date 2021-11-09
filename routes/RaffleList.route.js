const { Router } = require("express");
const router = Router();
const { check, param } = require("express-validator");

const { validateJWT } = require("../middlewares/validateJWT");
const { validateRequest } = require("../middlewares/validateRequest");

const { raffleListIdValidator } = require("../middlewares/raffleListValidator");
const { userNameExistsValidator } = require("../middlewares/UserValidator");

const {
  getListsByAlias,
  assignListToUser,
  getListByAliasAndListNumber,
} = require("../controllers/RaffleList.controller");


router.get("/:alias", getListsByAlias);

router.get("/:alias/list/:listNumber", getListByAliasAndListNumber);

router.put(
  "/assign/:raffleListId",
  [
    validateJWT,
    param("raffleListId").custom(raffleListIdValidator),
    check("userName").custom(userNameExistsValidator),
    validateRequest
  ],
  assignListToUser
);

module.exports = router;
