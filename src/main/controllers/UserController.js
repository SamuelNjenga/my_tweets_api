const { sequelize } = require("../db/models");

const userService = require("../services/UserService");

const ReqValidator = require("../utils/validator");

exports.createUser = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const valid = await ReqValidator.validate(req, res, {
      firstName: "required|string",
      lastName: "required|string",
      email: "required|string",
    });
    if (!valid) return;
    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    };
    await userService.createUser(data, transaction);
    await transaction.commit();
    res.status(201).json({ data, message: `A new user has been created` });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.json({
      message: err,
    });
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const valid = await ReqValidator.validate(req, res, {
      firstName: "string",
      laststName: "string",
      email: "string",
    });
    if (!valid) return;
    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    };

    const userId = req.params.id;

    const user = await userService.getUser(userId);

    if (!user) {
      await transaction.commit();
      return res.status(200).json({
        message: `User ${userId} does not exist in our database`,
      });
    }

    await userService.updateUser(
      data,
      {
        where: {
          id: userId,
        },
      },
      transaction
    );
    await transaction.commit();
    res.status(200).json({ data, message: `User ${userId} has been updated` });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.params.id;

    const user = await userService.getUser(userId);

    if (!user) {
      await transaction.commit();
      return res.status(404).json({
        message: `User ${userId} does not exist in our database`,
      });
    }

    await userService.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      transaction
    );
    await transaction.commit();
    res.status(200).json({
      message: `User ${userId} has been deleted`,
    });
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
