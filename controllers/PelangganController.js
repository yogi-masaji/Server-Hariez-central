const { pelanggan } = require("../models/index");
const NodeCache = require("node-cache");
const cache = new NodeCache();

class PelangganController {
    static async createPelanggan(req, res, next) {
        try {
            const { nama, nomorTelepon, email } = req.body;
            const dataPelanggan = await pelanggan.create({
                nama,
                nomorTelepon,
                email,
            });
            res.status(201).json(dataPelanggan);
        } catch (error) {
            next(error);
        }
    }

    static async getAllPelanggan(req, res, next) {
        try {
            const dataPelanggan = await pelanggan.findAll();
            res.status(200).json({
                "Data Pelanggan": dataPelanggan,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getPelangganById(req, res, next) {
        try {
            const { id } = req.params;
            const dataPelanggan = await pelanggan.findOne({ where: { id } });
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

    static async updatePelanggan(req, res, next) {
        try {
            const { id } = req.params;
            const { nama, nomorTelepon, email } = req.body;
            const dataPelanggan = await pelanggan.update(
                { nama, nomorTelepon, email },
                { where: { id } }
            );
            const dataPelangganUpdated = await pelanggan.findOne({
                where: { id },
            });
            res.status(200).json(dataPelangganUpdated);
        } catch (error) {
            next(error);
        }
    }

    static async deletePelanggan(req, res, next) {
        try {
            const { id } = req.params;
            const dataPelanggan = await pelanggan.destroy({ where: { id } });
            res.status(200).json({ message: "Pelanggan berhasil dihapus!" });
        } catch (error) {
            next(error);
        }
    }

    static async getPelangganDetail(req, res, next) {
        const idPelanggan = req.user.id;
        try {
            const dataPelanggan = await pelanggan.findOne({
                where: { id: idPelanggan },
            });
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
}

module.exports = PelangganController;
