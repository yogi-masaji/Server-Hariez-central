const router = require("express").Router();
const PerbaikanController = require("../controllers/PerbaikanController");

router.get("/test", (req, res) => {
    res.status(200).json({ message: "router perbaikan!" });
});
router.get("/new", PerbaikanController.getNewPerbaikan);
router.post("/new", PerbaikanController.createNewPerbaikan);
router.post("/", PerbaikanController.createPerbaikan);
router.get("/laporan", PerbaikanController.getMonthlyPerbaikan);
router.get("/laporan/:key", PerbaikanController.getMonthlyPerbaikanByKey);
router.get("/", PerbaikanController.getPerbaikan);
router.get("/:id", PerbaikanController.getPerbaikanById);
router.get("/chart/total", PerbaikanController.chartPerbaikan);
router.get(
    "/kodePerbaikan/:kode",
    PerbaikanController.getPerbaikanByKodePerbaikan
);
router.put("/:id", PerbaikanController.updatePerbaikan);
router.delete("/:id", PerbaikanController.deletePerbaikan);

module.exports = router;
