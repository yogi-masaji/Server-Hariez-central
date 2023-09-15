const { User, Antrian } = require("../models/index");

async function authorizationUser(req, res, next) {
    const { userId } = req.params;
    const authUser = req.user.id;
    try {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) throw { name: "ErrNotFound" };
        if (user.id === authUser) {
            return next();
        } else {
            throw { name: "Unauthorized" };
        }
    } catch (error) {
        next(error);
    }
}

async function authorizationAntrian(req, res, next) {
    const { AntrianId } = req.params;
    const authUser = req.user.id;
    try {
        const foundAntrian = await Antrian.findOne({
            where: { id: AntrianId },
        });
        if (!foundAntrian) throw { name: "ErrNotFound" };
        if (foundAntrian.idPelanggan === authUser) {
            return next();
        } else {
            throw { name: "Unauthorized" };
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    authorizationUser,
    authorizationAntrian,
};
