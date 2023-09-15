const router = require("express").Router();
const KomplainController = require("../controllers/KomplainController");
const UserAuthenticationMiddleware = require("../middlewares/UserAuthentication");

router.get("/test", (req, res) => {
    res.status(200).json({ message: "router komplain!" });
});

router.get("/", KomplainController.getAllKomplain);
router.get("/:id", KomplainController.getKomplainById);

router.use(UserAuthenticationMiddleware);
router.post("/", KomplainController.createKomplain);
router.put("/:id", KomplainController.updateKomplain);
router.delete("/:id", KomplainController.deleteKomplain);
router.get("/komplaindetails/user", KomplainController.getUserKomplain);

module.exports = router;
