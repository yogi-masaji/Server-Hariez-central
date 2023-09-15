const router = require("express").Router();
const PembayaranController = require("../controllers/PembayaranController");
const UserAuthenticationMiddleware = require("../middlewares/UserAuthentication");
const multer = require("multer");

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

router.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
router.get("/test", (req, res) => {
    res.status(200).json({ message: "router Pembayaran!" });
});
router.get("/", PembayaranController.getAllPembayaran);
router.get("/:idPembayaran", PembayaranController.getPembayaranById);
router.delete("/:idPembayaran", PembayaranController.deletePembayaran);
router.put("/:idPembayaran", PembayaranController.updatePembayaran);
router.put("/konfirmasi/:id", PembayaranController.konfirmasiPembayaran);
router.use(UserAuthenticationMiddleware);
router.post("/", PembayaranController.createPembayaran);

module.exports = router;
