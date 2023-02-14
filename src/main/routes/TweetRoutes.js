const Router = require("express");

const tweetController = require("../controllers/TweetController");

const router = Router();

router.post("/", tweetController.createTweet);
router.get("/", tweetController.getTweets);
router.get("/all", tweetController.getAllTweets);
router.get("/infinite", tweetController.getInfiniteTweets);
router.delete("/:id", tweetController.deleteTweet);
router.put("/:id", tweetController.updateTweet);

module.exports = router;
