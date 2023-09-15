const router = require("express").Router();
const AntrianController = require("../controllers/AntrianController");
const {
    authorizationAntrian,
} = require("../middlewares/UserAuthorizationMiddleware");
const UserAuthenticationMiddleware = require("../middlewares/UserAuthentication");
router.get("/test", (req, res) => {
    res.status(200).json({ message: "router antrian!" });
});
router.get("/admin", AntrianController.getAllToday);
router.get("/admin/all", AntrianController.getAll);
router.put("/admin/:id", AntrianController.updateAntrian);
router.get("/admin/:id", AntrianController.getAntrianById);
router.get("/chart/pelayanan", AntrianController.chartPelayanan);
router.use(UserAuthenticationMiddleware);
router.post("/", AntrianController.create);
router.get("/", AntrianController.getAll);
router.get("/user/today", AntrianController.getUserAntrianToday);
router.get("/user", AntrianController.getUserAntrianAll);
router.delete("/:id", AntrianController.deleteAntrian);
// router.put("/:antrianId", authorizationAntrian, AntrianController.update);
module.exports = router;
