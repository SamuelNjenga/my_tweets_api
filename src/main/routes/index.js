const Router = require("express");

const UserRoutes = require("./UserRoutes");
const TweetRoutes = require("./TweetRoutes");


const router = Router();

router.use("/users", UserRoutes);
router.use("/tweets", TweetRoutes);


module.exports = router;
