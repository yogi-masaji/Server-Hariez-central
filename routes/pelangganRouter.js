const router = require("express").Router();
const PelangganController = require("../controllers/PelangganController");

router.get("/test", (req, res) => {
    res.status(200).json({ message: "router pelanggan!" });
});

router.post("/", PelangganController.createPelanggan);
router.get("/", PelangganController.getAllPelanggan);
router.get("/:id", PelangganController.getPelangganById);
router.put("/:id", PelangganController.updatePelanggan);
router.delete("/:id", PelangganController.deletePelanggan);

module.exports = router;
