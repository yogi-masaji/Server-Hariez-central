const { Admin } = require("../models/index");

async function adminAuthorization(req, res, next) {
    const { adminId } = req.params;
    const authAdmin = req.user.id;
    try {
        const admin = await Admin.findOne({ where: { id: adminId } });
        if (!admin) throw { name: "ErrNotFound" };
        if (admin.id === authAdmin) {
            return next();
        } else {
            throw { name: "Unauthorized" };
        }
    } catch (error) {
        next(error);
    }
}

module.exports = { adminAuthorization };
