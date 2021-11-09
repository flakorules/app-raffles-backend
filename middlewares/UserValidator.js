const User = require("../models/User.model");

const userIdValidator = async (value) => {
  const user = await User.findById(value);

  if (!user) {
    throw new Error("userId does not exist in DB");
  }

  return true;
};

const userNameExistsValidator = async (value) => {
  const user = await User.find({ userName: value });
  if (!user) {
    throw new Error("userName does not exists in DB");
  }
  return true;
};

const userNameValidator = async (value) => {
  const user = await User.find({ userName: value });
  if (user.length !== 0) {
    throw new Error("userName already exists in DB");
  }
  return true;
};

const userNameInUseValidator = async (value, { req }) => {
  const user = await User.findById(req.params.id);

  if (value !== user.userName) {
    const filteredUser = await User.find({ userName: value });
    if (filteredUser.length !== 0) {
      throw new Error("userName already exists in DB");
    }
  } else {
    return true;
  }

  return true;
};

const userEmailValidator = async (value) => {
  const user = await User.find({ email: value });

  if (user.length !== 0) {
    throw new Error("email already exists in DB");
  }
  return true;
};

const userEmailInUseValidator = async (value, { req }) => {
  const user = await User.findById(req.params.id);

  if (value !== user.email) {
    const filteredUser = await User.find({ email: value });
    if (filteredUser.length !== 0) {
      throw new Error("email already exists in DB");
    }
  } else {
    return true;
  }

  return true;
};

const userValidateChangePassword = async (value, { req }) => {
  if (req.params.id !== req.uid) {
    throw new Error("req.params.id !== req.uid");
  } else {
    const user = await User.findById(req.params.id);

    if (user.userName !== req.body.userName) {
      throw new Error("user.userName !== req.body.userName");
    }
  }

  return true;
};

module.exports = {
  userIdValidator,
  userNameValidator,
  userNameExistsValidator,
  userEmailValidator,
  userNameInUseValidator,
  userEmailInUseValidator,
  userValidateChangePassword,
};
