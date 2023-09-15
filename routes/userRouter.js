const router = require("express").Router();
const UserController = require("../controllers/UserController");
const {
    authorizationUser,
} = require("../middlewares/UserAuthorizationMiddleware");
const UserAuthenticationMiddleware = require("../middlewares/UserAuthentication");

router.get("/tes", (req, res) => {
    res.status(200).json({ message: "router user!" });
});

router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getUserById);
router.put("/update/admin/:userAdminId", UserController.updateFromAdmin);
router.delete("/:userId", UserController.delete);
router.use(UserAuthenticationMiddleware);
router.get("/details/info", UserController.getUserDetail);
router.put("/update/:userId", authorizationUser, UserController.update);
router.put(
    "/update/password/:userId",
    authorizationUser,
    UserController.updatePassword
);
module.exports = router;
