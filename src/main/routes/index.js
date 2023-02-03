const Router = require("express");

const UserRoutes = require("./UserRoutes");

const router = Router();

router.use("/users", UserRoutes);

module.exports = router;
