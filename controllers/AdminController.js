const { hash, compare } = require("../helpers/hash");
const { sign, verify } = require("../helpers/jwt");
const { Admin } = require("../models/index");

class AdminController {
    static async signup(req, res, next) {
        const { nama, email, nomorTelepon, password } = req.body;
        const hashedPassword = hash(password);
        try {
            const admin = await Admin.create({
                nama,
                email,
                nomorTelepon,
                password: hashedPassword,
            });
            res.status(201).json({ admin });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        const { email: loginEmail, password } = req.body;
        try {
            if (!loginEmail || !password)
                throw { name: "EmailOrPasswordEmpty" };
            const admin = await Admin.findOne({ where: { email: loginEmail } });
            if (!admin) throw { name: "EmailNotFound" };
            if (!compare(password, admin.password))
                throw { name: "WrongPassword" };
            const { id, nama, email, nomorTelepon } = admin; // Extract specific fields from admin object
            const token = sign({ id, email });
            res.status(200).json({
                token,
                admin: { id, nama, email, nomorTelepon },
            }); // Include the extracted fields in the response
        } catch (error) {
            next(error);
        }
    }
    static async getAdminData(req, res, next) {
        try {
            const id = req.user.id; // Assuming the authenticated admin's ID is stored in req.user
            if (!id) {
                throw { name: "InvalidUserId" };
            }

            const admin = await Admin.findByPk(id);

            if (!admin) {
                throw { name: "AdminNotFound" };
            }

            const { nama, email, nomorTelepon } = admin;

            res.status(200).json({
                id,
                nama,
                email,
                nomorTelepon,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async getAllAdmin(req, res, next) {
        try {
            const admin = await Admin.findAll();
            res.status(200).json({ admin });
        } catch (error) {
            console.log(error);
        }
    }
    static async getAdminById(req, res, next) {
        const { id } = req.params;
        try {
            const admin = await Admin.findOne({ where: { id } });
            if (!admin) throw { name: "AdminNotFound" };
            res.status(200).json({ admin });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        const { email, nama, nomorTelepon } = req.body;
        const { adminId } = req.params;
        try {
            const user = await Admin.update(
                {
                    email: email,
                    nama: nama,
                    nomorTelepon: nomorTelepon,
                },
                {
                    where: {
                        id: adminId,
                    },
                }
            );

            const admin = await Admin.findOne({ where: { id: adminId } });
            res.status(200).json({ admin });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async updatePassword(req, res, next) {
        const { password } = req.body;
        const { adminId } = req.params;
        try {
            const hashedPassword = hash(password); // Assuming you have a hash function to hash the password

            const [updatedCount] = await Admin.update(
                { password: hashedPassword },
                {
                    where: {
                        id: adminId,
                    },
                }
            );

            if (updatedCount === 0) {
                throw { name: "AdminNotFound" };
            }

            const admin = await Admin.findOne({ where: { id: adminId } });
            res.status(200).json({ admin });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async delete(req, res, next) {
        const { adminId } = req.params;
        try {
            const user = await Admin.destroy({
                where: {
                    id: adminId,
                },
            });
            res.status(200).json({ message: "Admin berhasil dihapus" });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = AdminController;
