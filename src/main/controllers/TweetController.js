const { Op } = require("sequelize");
const { sequelize } = require("../db/models");

const tweetService = require("../services/TweetService");

const ReqValidator = require("../utils/validator");

exports.createTweet = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const valid = await ReqValidator.validate(req, res, {
      message: "required|string",
      userId: "required|integer",
    });
    if (!valid) return;
    const data = {
      message: req.body.message,
      userId: req.body.userId,
    };

    await tweetService.createTweet(data, transaction);
    await transaction.commit();
    res.status(201).json({ data, message: `A new tweet has been created` });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

exports.getTweets = async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = tweetService.getPagination(page, size);
  try {
    const tweets = await tweetService.getTweets({ limit, offset });
    const updatedTweets = tweetService.getPagingData(tweets, page, limit);
    res.status(200).json(updatedTweets);
  } catch (err) {
    res.json({
      message: err,
    });
    next(err);
  }
};

exports.getAllTweets = async (req, res, next) => {
  const limit = req.query.limit ? +req.query.limit : 5;
  const last_tweet = req.query.lastTweet ? +req.query.lastTweet : 0;
  let result = [];
  if (last_tweet < 1) {
    try {
      const tweets = await tweetService.getAllTweets({ limit: limit });
      result = tweets;
    } catch (err) {
      res.json({
        message: err,
      });
      next(err);
    }
  } else {
    try {
      const tweets = await tweetService.getAllTweets({
        where: { id: { [Op.gt]: last_tweet } },
        limit: limit,
      });
      result = tweets;
    } catch (err) {
      res.json({
        message: err,
      });
      next(err);
    }
  }
  res.json({
    result: result,
    lastTweet: result.length ? result[result.length - 1].id : 0,
    hasMore: result.length >= limit ? true : false,
    nextPage: 1
  });
};

exports.updateTweet = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const valid = await ReqValidator.validate(req, res, {
      message: "string",
      noOfLikes: "integer",
      userId: "integer",
    });
    if (!valid) return;
    const data = {
      message: req.body.message,
      noOfLikes: req.body.noOfLikes,
      userId: req.body.userId,
    };

    const tweetId = req.params.id;

    const tweet = await tweetService.getTweet(tweetId);

    if (!tweet) {
      await transaction.commit();
      return res.status(200).json({
        message: `Tweet ${tweetId} does not exist in our database`,
      });
    }

    await tweetService.updateTweet(
      data,
      {
        where: {
          id: tweetId,
        },
      },
      transaction
    );
    await transaction.commit();
    res
      .status(200)
      .json({ data, message: `Tweet ${tweetId} has been updated` });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

exports.deleteTweet = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const tweetId = req.params.id;

    const tweet = await tweetService.getTweet(tweetId);

    if (!tweet) {
      await transaction.commit();
      return res.status(200).json({
        message: `Tweet ${tweetId} does not exist in our database`,
      });
    }

    await tweetService.deleteTweet(
      {
        where: {
          id: tweetId,
        },
      },
      transaction
    );
    await transaction.commit();
    res.status(200).json({
      message: `Tweet ${tweetId} has been deleted`,
    });
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
