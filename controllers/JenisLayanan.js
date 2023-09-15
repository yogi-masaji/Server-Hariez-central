const {
    pelanggan,
    Perbaikan,
    PerbaikanNew,
    teknisi,
    User,
    Antrian,
    Status,
    Komplain,
    Pembayaran,
    JenisPerbaikan,
} = require("../models/index");

class JenisPerbaikanController {
    static async getAllJenisPerbaikan(req, res, next) {
        try {
            const jenisPerbaikan = await JenisPerbaikan.findAll();
            res.status(200).json(jenisPerbaikan);
        } catch (error) {
            console.log(error);
        }
    }
    static async createJenisPerbaikan(req, res, next) {
        const { jenis } = req.body;
        try {
            const jenisPerbaikan = await JenisPerbaikan.create({
                jenis,
            });
            res.status(201).json(jenisPerbaikan);
        } catch (error) {
            console.log(error);
        }
    }

    static async getJenisPerbaikanById(req, res, next) {
        const id = req.params.id;
        try {
            const jenisPerbaikan = await JenisPerbaikan.findByPk(id);
            res.status(200).json(jenisPerbaikan);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = JenisPerbaikanController;
