const { hash, compare } = require("../helpers/hash");
const { sign, verify } = require("../helpers/jwt");
const { User } = require("../models/index");

class UserController {
    static async signup(req, res, next) {
        const { nama, email, nomorTelepon, password } = req.body;
        const hashedPassword = hash(password);
        try {
            const user = await User.create({
                nama,
                email,
                nomorTelepon,
                password: hashedPassword,
            });
            res.status(201).json({ user });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        const { email, password } = req.body;
        try {
            if (!email || !password) throw { name: "EmailOrPasswordEmpty" };
            const user = await User.findOne({ where: { email } });
            if (!user) throw { name: "EmailNotFound" };
            if (!compare(password, user.password))
                throw { name: "WrongPassword" };
            const { id, nama, email: userEmail, nomorTelepon } = user; // Extract specific fields from user object
            const token = sign({ id, email: userEmail });
            res.status(200).json({
                token,
                user: { id, nama, email: userEmail, nomorTelepon },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllUser(req, res, next) {
        try {
            const dataPelanggan = await User.findAll();
            res.status(200).json({
                "Data Pelanggan": dataPelanggan,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUserDetail(req, res, next) {
        const userId = req.user.id;
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw { name: "UserNotFound" };
            }
            const { id, nama, email, nomorTelepon } = user;
            res.status(200).json({ id, nama, email, nomorTelepon });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    static async updatePassword(req, res, next) {
        const { password } = req.body;
        const { userId } = req.params;
        try {
            const hashedPassword = hash(password); // Assuming you have a hash function to hash the password

            const [updatedCount] = await User.update(
                { password: hashedPassword },
                {
                    where: {
                        id: userId,
                    },
                }
            );

            if (updatedCount === 0) {
                throw { name: "UserNotFound" };
            }

            const user = await User.findOne({ where: { id: userId } });
            res.status(200).json({ user });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const dataPelanggan = await User.findOne({ where: { id } });
            if (!dataPelanggan) {
                const error = {
                    status: 404,
                    message: "Data pelanggan not found",
                };
                throw error;
            }
            res.status(200).json({ dataPelanggan });
        } catch (error) {
            next(error);
        }
    }
    static async updateFromAdmin(req, res, next) {
        const { nama, email, nomorTelepon } = req.body;
        const { userAdminId } = req.params;
        try {
            const user = await User.update(
                {
                    nama: nama,
                    email: email,
                    nomorTelepon: nomorTelepon,
                },
                {
                    where: { id: userAdminId },
                }
            );
            const updatedUser = await User.findOne({
                where: { id: userAdminId },
            });
            res.status(200).json({ updatedUser });
        } catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        const { nama, email, nomorTelepon } = req.body;
        const { userId } = req.params;
        try {
            const user = await User.update(
                {
                    nama: nama,
                    email: email,
                    nomorTelepon: nomorTelepon,
                },
                {
                    where: { id: userId },
                }
            );
            const updatedUser = await User.findOne({ where: { id: userId } });
            res.status(200).json({ updatedUser });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        const { userId } = req.params;
        try {
            const user = await User.destroy({ where: { id: userId } });
            res.status(200).json({
                message: "Your account has been successfully deleted",
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = UserController;
