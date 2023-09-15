const {
    pelanggan,
    Perbaikan,
    PerbaikanNew,
    teknisi,
    User,
    Antrian,
    Status,
    Komplain,
} = require("../models/index");

class KomplainController {
    static async createKomplain(req, res, next) {
        const idPelanggan = req.user.id;
        const { idPerbaikan, komplain } = req.body;
        try {
            const komplainCreate = await Komplain.create({
                idPelanggan,
                idPerbaikan,
                komplain,
            });
            res.status(201).json(komplainCreate);
        } catch (error) {
            console.log(error);
        }
    }
    static async getAllKomplain(req, res, next) {
        try {
            const dataKomplain = await Komplain.findAll({
                include: [
                    {
                        model: User,
                        attributes: ["id", "nama", "email", "nomorTelepon"],
                    },
                    {
                        model: PerbaikanNew,
                        include: [
                            {
                                model: teknisi,
                                attributes: ["id", "nama", "email"],
                            },
                        ],
                    },
                ],
            });

            res.status(200).json({
                "Data Komplain": dataKomplain,
            });
        } catch (error) {
            next(error);
        }
    }
    static async getKomplainById(req, res, next) {
        try {
            const id = req.params.id;
            const dataKomplain = await Komplain.findOne({
                where: { id },
                // include: [PerbaikanNew],
            });
            res.status(200).json(dataKomplain);
        } catch (error) {
            next(error);
        }
    }
    static async deleteKomplain(req, res, next) {
        try {
            const id = req.params.id;
            const komplainDelete = await Komplain.destroy({ where: { id } });
            res.status(200).json({ message: "Komplain berhasil dihapus!" });
        } catch (error) {
            next(error);
        }
    }
    static async updateKomplain(req, res, next) {
        try {
            const id = req.params.id;
            const { komplain } = req.body;
            const komplainUpdate = await Komplain.update(
                { komplain },
                { where: { id } }
            );
            const komplainUpdated = await Komplain.findOne({ where: { id } });
            res.status(200).json(komplainUpdated);
        } catch (error) {
            next(error);
        }
    }
    static async getUserKomplain(req, res, next) {
        try {
            const idPelanggan = req.user.id;
            const dataKomplain = await Komplain.findAll({
                where: { idPelanggan },
                include: [
                    {
                        model: PerbaikanNew,
                        include: [
                            {
                                model: teknisi,
                                attributes: ["id", "nama", "email"],
                            },
                        ],
                    },
                ],
            });
            res.status(200).json(dataKomplain);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = KomplainController;
