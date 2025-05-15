const router = require("express").Router();

// Authentication Router Middleware
router.use("/auth", require("./auth.routes"));

router.use("/common", require("./common.routes"));

// protected routes
router.use("/admin", require("./admin.routes"));

module.exports = router;