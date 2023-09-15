const { PerbaikanNew, Status } = require("../models/index");

class StatusController {
    static async getAllStatus(req, res, next) {
        try {
            const dataStatus = await Status.findAll();
            res.status(200).json(dataStatus);
        } catch (error) {
            next(error);
        }
    }
    static async getStatusById(req, res, next) {
        try {
            const id = req.params.id;
            const dataStatus = await Status.findOne({ where: { id } });
            res.status(200).json(dataStatus);
        } catch (error) {
            next(error);
        }
    }
    static async createStatus(req, res, next) {
        const { idPerbaikan, status } = req.body;
        try {
            const statusCreate = await Status.create({
                idPerbaikan,
                status,
            });
            res.status(201).json(statusCreate);
        } catch (error) {
            console.log(error);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const id = req.params.id;
            const { status } = req.body;
            const statusUpdate = await Status.update(
                { status },
                { where: { id } }
            );
            const statusUpdated = await Status.findOne({ where: { id } });
            res.status(200).json(statusUpdated);
        } catch (error) {
            next(error);
        }
    }
    static async deleteStatus(req, res, next) {
        try {
            const id = req.params.id;
            const statusDelete = await Status.destroy({ where: { id } });
            res.status(200).json({ message: "Status berhasil dihapus!" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = StatusController;
