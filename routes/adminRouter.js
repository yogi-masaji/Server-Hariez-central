const router = require("express").Router();
const AdminController = require("../controllers/AdminController");
const {
    adminAuthorization,
} = require("../middlewares/AuthorizationMiddleware");
const { adminAuthentication } = require("../middlewares/AdminAuthentication");
router.get("/", (res) => {
    res.status(200).json({ message: "Connected!" });
});

router.get("/detail", AdminController.getAdminData);
router.get("/adminAll", AdminController.getAllAdmin);
router.get("/getbyid/:id", AdminController.getAdminById);
router.put("/update/:adminId", adminAuthorization, AdminController.update);
router.put(
    "/update/password/:adminId",
    adminAuthorization,
    AdminController.updatePassword
);
router.delete("/delete/:adminId", adminAuthorization, AdminController.delete);
module.exports = router;
