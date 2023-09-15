const {
    User,
    Antrian,
    PerbaikanNew,
    Pembayaran,
    JenisPerbaikan,
} = require("../models/index");
const { nanoid, customAlphabet } = require("nanoid");
const { Op } = require("sequelize");

class AntrianController {
    static async create(req, res, next) {
        const {
            TanggalAntrian,
            idJenis,
            kendala,
            alamatJemput,
            metodePengantaran,
        } = req.body;
        const idPelanggan = req.user.id;
        try {
            const nanoid = customAlphabet(
                "1234567890abcdefghijklmnopqrstuvwxyz",
                8
            );
            const today = new Date(TanggalAntrian);
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const lastAntrian = await Antrian.findOne({
                where: {
                    TanggalAntrian: {
                        [Op.gte]: today,
                        [Op.lt]: tomorrow,
                    },
                },
                order: [["createdAt", "DESC"]],
            });

            let NoAntrian;
            if (!lastAntrian) {
                NoAntrian = "A01";
            } else {
                const lastChar = lastAntrian.NoAntrian.charAt(0);
                const lastNumber = parseInt(lastAntrian.NoAntrian.substr(1));
                if (lastNumber === 99) {
                    const nextChar = String.fromCharCode(
                        lastChar.charCodeAt(0) + 1
                    );
                    NoAntrian = `${nextChar}01`;
                } else {
                    const nextNumber = lastNumber + 1;
                    const formattedNumber = nextNumber
                        .toString()
                        .padStart(2, "0");
                    NoAntrian = `${lastChar}${formattedNumber}`;
                }
            }

            const id = nanoid();
            const antrian = await Antrian.create({
                id,
                idPelanggan,
                NoAntrian,
                TanggalAntrian,
                status: "Pending", // Add the new "status" column with a default value
                idJenis,
                kendala,
                alamatJemput,
                metodePengantaran,
            });
            res.status(201).json(antrian);
        } catch (error) {
            console.log(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 6);

            const antrians = await Antrian.findAll({
                where: {
                    TanggalAntrian: {
                        [Op.gte]: today,
                        [Op.lt]: tomorrow,
                    },
                },
                include: [
                    {
                        model: User,
                        attributes: ["id", "nama", "email", "nomorTelepon"],
                    },
                    {
                        model: PerbaikanNew,
                    },
                    {
                        model: JenisPerbaikan,
                    },
                ],
                order: [
                    ["TanggalAntrian", "ASC"], // Order by TanggalAntrian in ascending order
                ],
            });

            res.status(200).json({
                "Data Antrian": antrians,
            });
        } catch (error) {
            next(error);
            console.log(error);
        }
    }
    static async chartPelayanan(req, res, next) {
        try {
            const antrians = await Antrian.findAll({
                where: {
                    idJenis: { [Op.not]: null }, // Filter out data with null idJenis
                },
            });

            // Fetch all jenis from JenisPerbaikan model
            const jenisPerbaikan = await JenisPerbaikan.findAll();

            // Create a map to store jenis data by idJenis
            const jenisDataMap = new Map();
            jenisPerbaikan.forEach((jenis) => {
                jenisDataMap.set(jenis.id.toString(), jenis.jenis); // Ensure idJenis is stored as a string
            });

            // Count the occurrences of each idJenis option
            const idJenisCounts = {};
            antrians.forEach((antrian) => {
                const { idJenis } = antrian;
                if (idJenisCounts[idJenis]) {
                    idJenisCounts[idJenis]++;
                } else {
                    idJenisCounts[idJenis] = 1;
                }
            });

            // Map the counts to an array of objects with idJenis and value properties
            const chartData = Object.entries(idJenisCounts).map(
                ([idJenis, value]) => ({
                    idJenis: idJenis, // You can use the actual idJenis value as the name for the chart
                    jenis: jenisDataMap.get(idJenis.toString()), // Retrieve jenis from the jenisDataMap using the stringified idJenis
                    value: value,
                })
            );

            res.status(200).json(chartData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async getAllToday(req, res, next) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const antrians = await Antrian.findAll({
                where: {
                    TanggalAntrian: {
                        [Op.gte]: today,
                        [Op.lt]: tomorrow,
                    },
                },
                include: [
                    {
                        model: User,
                        attributes: ["id", "nama", "email"],
                    },
                    {
                        model: JenisPerbaikan,
                    },
                ],
            });

            res.status(200).json({
                "Data Antrian": antrians,
            });
        } catch (error) {
            next(error);
            console.log(error);
        }
    }

    static async getUserAntrianToday(req, res, next) {
        const idPelanggan = req.user.id;
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const antrians = await Antrian.findAll({
                where: {
                    idPelanggan,
                    TanggalAntrian: {
                        [Op.gte]: today,
                        [Op.lt]: tomorrow,
                    },
                },
                include: [
                    {
                        model: User,
                        attributes: ["id", "nama"],
                    },
                    {
                        model: JenisPerbaikan,
                    },
                ],
            });

            res.status(200).json({ antrians });
        } catch (error) {
            console.log(error);
        }
    }
    static async getUserAntrianAll(req, res, next) {
        const idPelanggan = req.user.id;
        try {
            const antrians = await Antrian.findAll({
                where: {
                    idPelanggan,
                },
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: User,
                        attributes: ["id", "nama"],
                    },
                    {
                        model: PerbaikanNew,
                        include: [
                            {
                                model: Pembayaran,
                            },
                        ],
                    },
                    {
                        model: JenisPerbaikan,
                    },
                ],
            });

            res.status(200).json({ antrians });
        } catch (error) {
            console.log(error);
        }
    }
    static async updateAntrian(req, res, next) {
        const id = req.params.id;
        const { status } = req.body;
        try {
            const antrian = await Antrian.update(
                {
                    status,
                },
                {
                    where: {
                        id,
                    },
                }
            );
            res.status(200).json({ message: "Antrian berhasil diupdate" });
        } catch (error) {
            console.log(error);
        }
    }
    static async getAntrianById(req, res, next) {
        const id = req.params.id;
        try {
            const antrian = await Antrian.findOne({
                where: {
                    id,
                },
                include: [
                    {
                        model: User,
                        attributes: ["id", "nama", "email", "nomorTelepon"],
                    },
                    {
                        model: PerbaikanNew,
                    },
                    {
                        model: JenisPerbaikan,
                    },
                ],
            });
            res.status(200).json({
                "Data Antrian": antrian,
            });
        } catch (error) {
            console.log(error);
        }
    }
    static async deleteAntrian(req, res, next) {
        const id = req.params.id;
        try {
            const antrian = await Antrian.destroy({
                where: {
                    id,
                },
            });
            res.status(200).json({ message: "Antrian berhasil dihapus" });
        } catch (error) {
            next(error);
            console.log(error);
        }
    }
}

module.exports = AntrianController;
