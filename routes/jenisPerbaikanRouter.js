const router = require("express").Router();
const JenisPerbaikanController = require("../controllers/JenisLayanan");
router.get("/test", (req, res) => {
    res.status(200).json({ message: "router jenis perbaikan!" });
});

router.get("/", JenisPerbaikanController.getAllJenisPerbaikan);

router.post("/", JenisPerbaikanController.createJenisPerbaikan);

router.get("/:id", JenisPerbaikanController.getJenisPerbaikanById);

module.exports = router;
