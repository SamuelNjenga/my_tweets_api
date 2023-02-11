const db = require("../db/models/index");

exports.createTweet = async (data) => {
  return db.Tweet.create(data);
};

exports.updateTweet = async (data, root) => {
  return db.Tweet.update(data, root);
};

exports.getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

exports.getPagingData = (data, page, limit) => {
  const { count: totalTweets, rows: tweets } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalTweets / limit);

  return { totalTweets, tweets, totalPages, currentPage };
};

exports.getTweets = async (data) => {
  return db.Tweet.findAndCountAll(data);
};

exports.getAllTweets = async (data) => {
  return db.Tweet.findAll(data);
};

exports.getTweet = async (data) => {
  return db.Tweet.findByPk(data);
};

exports.deleteTweet = async (data) => {
  return db.Tweet.destroy(data);
};
