// api/users

const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");

const {
  createUser,
  updateUser,
  loginUser,
  updatePassword,
} = require("../controllers/User.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  userEmailValidator,
  userNameValidator,
  userNameInUseValidator,
  userEmailInUseValidator,
  userValidateChangePassword,
} = require("../middlewares/UserValidator");
const { validateJWT } = require("../middlewares/validateJWT");

router.post(
  "/new",
  [
    check("firstName")
      .notEmpty()
      .withMessage("firstName is mandatory")
      .isLength({ min: 6 })
      .withMessage("firstName length should be at least 6"),
    check("lastName")
      .notEmpty()
      .withMessage("lastName is mandatory")
      .isLength({ min: 6 })
      .withMessage("firstName length should be at least 6"),
    check("userName")
      .notEmpty()
      .withMessage("userName is mandatory")
      .isLength({ min: 6 })
      .withMessage("userName length should be at least 6")
      .custom(userNameValidator),
    check("email")
      .notEmpty()
      .withMessage("email is mandatory")
      .isEmail()
      .withMessage("email format is not correct")
      .custom(userEmailValidator),
    check("password")
      .notEmpty()
      .withMessage("password is mandatory")
      .isLength({ min: 6 })
      .withMessage("password length should be at least 6"),
    validateRequest,
  ],
  createUser
);

router.put(
  "/update/:id",
  [
    validateJWT,
    check("firstName")
      .notEmpty()
      .withMessage("firstName is mandatory")
      .isLength({ min: 6 })
      .withMessage("firstName length should be at least 6"),
    check("lastName")
      .notEmpty()
      .withMessage("lastName is mandatory")
      .isLength({ min: 6 })
      .withMessage("firstName length should be at least 6"),
    check("userName")
      .notEmpty()
      .withMessage("userName is mandatory")
      .isLength({ min: 6 })
      .withMessage("userName length should be at least 6")
      .custom(userNameInUseValidator),
    check("email")
      .notEmpty()
      .withMessage("email is mandatory")
      .isEmail()
      .withMessage("email format is not correct")
      .custom(userEmailInUseValidator),
    validateRequest,
  ],
  updateUser
);

router.post(
  "/login",
  [
    check("userName")
      .notEmpty()
      .withMessage("userName is mandatory")
      .isLength({ min: 6 })
      .withMessage("userName length should be at least 6"),
    check("password")
      .notEmpty()
      .withMessage("password is mandatory")
      .isLength({ min: 6 })
      .withMessage("password length should be at least 6"),
    validateRequest,
  ],
  loginUser
);

router.patch(
  "/changePassword/:id",
  [
    validateJWT,
    check("userName")
      .notEmpty()
      .withMessage("userName is mandatory")
      .isLength({ min: 6 })
      .withMessage("userName length should be at least 6")
      .custom(userValidateChangePassword),
    check("password")
      .notEmpty()
      .withMessage("password is mandatory")
      .isLength({ min: 6 })
      .withMessage("password length should be at least 6"),
    validateRequest,
  ],
  updatePassword
);

module.exports = router;
