const db = require("../db/models/index");

exports.createTweet = async (data) => {
  return db.Tweet.create(data);
};

exports.updateTweet = async (data, root) => {
  return db.Tweet.update(data, root);
};

exports.getTweets = async () => {
  return db.Tweet.findAll();
};

exports.getTweet = async (data) => {
  return db.Tweet.findByPk(data);
};

exports.deleteTweet = async (data) => {
  return db.Tweet.destroy(data);
};
