const router = require("express").Router();
const PerbaikanController = require("../controllers/PerbaikanController");
const UserAuthenticationMiddleware = require("../middlewares/UserAuthentication");

router.get("/tes", (req, res) => {
    res.status(200).json({ message: "router user perbaikan!" });
});

router.use(UserAuthenticationMiddleware);
router.get("/v1", PerbaikanController.getUserPerbaikan);
router.get("/:perbaikanId", PerbaikanController.getUserPerbaikanById);

module.exports = router;
