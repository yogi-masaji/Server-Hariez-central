const router = require("express").Router();
const StatusController = require("../controllers/StatusController");

router.get("/test", (req, res) => {
    res.status(200).json({ message: "router status!" });
});
router.get("/", StatusController.getAllStatus);
router.get("/:id", StatusController.getStatusById);
router.post("/", StatusController.createStatus);
router.put("/:id", StatusController.updateStatus);
router.delete("/:id", StatusController.deleteStatus);
module.exports = router;
