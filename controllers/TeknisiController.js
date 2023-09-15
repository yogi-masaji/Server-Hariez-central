const { teknisi } = require("../models/index");

class TeknisiController {
    static async createTeknisi(req, res, next) {
        try {
            const { nama, nomorTelepon, email } = req.body;
            const dataTeknisi = await teknisi.create({
                nama,
                nomorTelepon,
                email,
            });
            res.status(201).json(dataTeknisi);
        } catch (error) {
            next(error);
        }
    }

    static async getAllTeknisi(req, res, next) {
        try {
            const dataTeknisi = await teknisi.findAll();
            res.status(200).json({
                "Data Pelanggan": dataTeknisi,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getTeknisiById(req, res, next) {
        try {
            const { id } = req.params;
            const dataTeknisi = await teknisi.findOne({ where: { id } });
            if (!dataTeknisi) {
                const error = {
                    status: 404,
                    message: "Data teknisi not found",
                };
                throw error;
            }
            res.status(200).json({ dataTeknisi });
        } catch (error) {
            next(error);
        }
    }

    static async updateTeknisi(req, res, next) {
        try {
            const { id } = req.params;
            const { nama, nomorTelepon, email } = req.body;
            const dataTeknisi = await teknisi.update(
                { nama, nomorTelepon, email },
                { where: { id } }
            );
            const dataTeknisiUpdated = await teknisi.findOne({ where: { id } });
            res.status(200).json(dataTeknisiUpdated);
        } catch (error) {
            next(error);
        }
    }

    static async deleteTeknisi(req, res, next) {
        try {
            const { id } = req.params;
            const dataTeknisi = await teknisi.destroy({ where: { id } });
            res.status(200).json({ message: "Teknisi berhasil dihapus!" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TeknisiController;
