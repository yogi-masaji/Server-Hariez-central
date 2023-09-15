const router = require("express").Router();
const teknisiRouter = require("./teknisiRouter");
const pelangganRouter = require("./pelangganRouter");
const perbaikanRouter = require("./perbaikanRouter");
const pembayaranRouter = require("./pembayaranRouter");
const adminRouter = require("./adminRouter");
const userRouter = require("./userRouter");
const komplainRouter = require("./komplainRouter");
const antrianRouter = require("./antrianRouter");
const statusRouter = require("./statusRouter");
const userPerbaikanRouter = require("./userPerbaikanRouter");
const AdminController = require("../controllers/AdminController");
const AdminAuthentication = require("../middlewares/AdminAuthentication");
const UserController = require("../controllers/UserController");
const PerbaikanController = require("../controllers/PerbaikanController");
const AntrianController = require("../controllers/AntrianController");

router.post("/user/signup", UserController.signup);
router.post("/user/login", UserController.login);

router.use("/antrian", antrianRouter);

router.use("/komplain", komplainRouter);
router.use("/pembayaran", pembayaranRouter);
router.use("/user/perbaikan/detail", userPerbaikanRouter);
router.get("/all/perbaikan", PerbaikanController.getNewPerbaikan);
router.get("/test", (req, res) => {
    res.status(200).json({ message: "Connected!" });
});
router.get(
    "/detail/kodePerbaikan/:kodePerbaikan",
    PerbaikanController.getByKodePerbaikan
);

router.get("/detail/statusPerbaikan/:id", PerbaikanController.getPerbaikanById);

router.use("/user", userRouter);
router.post("/signup", AdminController.signup);
router.post("/login", AdminController.login);

router.use("/jenisPerbaikan", require("./jenisPerbaikanRouter"));

router.use(AdminAuthentication);
router.use("/admin", adminRouter);
router.use("/perbaikan", perbaikanRouter);
router.use("/pelanggan", pelangganRouter);
router.use("/teknisi", teknisiRouter);
router.use("/status", statusRouter);
module.exports = router;
