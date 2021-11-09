const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User.model");
const { createJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
  try {
    let user = new User(req.body);

    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(user.password, salt);
    await user.save();

    const token = await createJWT(user.id, user.userName);

    res.status(201).json({
      ok: true,
      msg: "User.controller -> createUser",
      uid: user.id,
      userName: user.userName,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: User.controller -> createUser",
    });
  }
};

const updateUser = async (req, res = response) => {
  try {
    const uid = req.params.id;
    let { body } = req;
    delete body.password;
    const dbRes = await User.findByIdAndUpdate(uid, body, { new: true });

    res.status(201).json({
      ok: true,
      uid,
      user: body,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: User.controler -> updateUser",
    });
  }
};

const loginUser = async (req, res = response) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "User does not exist in DB",
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password does not match",
      });
    }

    const token = await createJWT(user.id, user.userName);

    res.status(201).json({
      ok: true,
      uid: user.id,
      userName: user.userName,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: User.controler -> loginUser",
    });
  }
};

const updatePassword = async (req, res = response) => {
  try {
    const uid = req.params.id;

    const { userName, password } = req.body;

    let user = await User.findById(uid);

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "User does not exist in DB",
      });
    }

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    const dbRes = await User.findByIdAndUpdate(user.id, user, {
      new: true,
    });

    const token = await createJWT(user.id, user.userName);

    res.status(201).json({
      ok: true,
      uid: user.id,
      userName: user.userName,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error: User.controler -> updatePassword",
    });
  }
};

module.exports = {
  createUser,
  updateUser,
  loginUser,
  updatePassword,
};
