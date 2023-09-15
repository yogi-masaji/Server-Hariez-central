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
const { nanoid, customAlphabet } = require("nanoid");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const { Op, literal } = require("sequelize");
const moment = require("moment");

class PerbaikanController {
    static async createPerbaikan(req, res, next) {
        const { idPelanggan, idTeknisi, biaya, kendala, deskripsiPerangkat } =
            req.body;
        try {
            const nanoid = customAlphabet(
                "1234567890abcdefghijklmnopqrstuvwxyz",
                8
            );
            const kodePerbaikan = nanoid(8);
            const perbaikan = await Perbaikan.create({
                idPelanggan,
                idTeknisi,
                biaya,
                kendala,
                deskripsiPerangkat,
                kodePerbaikan,
            });
            res.status(201).json(perbaikan);
        } catch (error) {
            next(error);
            console.log(error);
        }
    }

    static async createNewPerbaikan(req, res, next) {
        const { kodePerbaikan, idTeknisi, biaya, kendala, perangkat } =
            req.body;
        const status = "Dalam Proses Diagnosa";
        try {
            const perbaikan = await PerbaikanNew.create({
                kodePerbaikan,
                idTeknisi,
                biaya,
                kendala,
                perangkat,
                status,
            });

            const perbaikanData = await PerbaikanNew.findByPk(perbaikan.id, {
                include: [
                    {
                        model: teknisi,
                        attributes: ["nama"],
                    },
                    {
                        model: Antrian,
                        attributes: ["idPelanggan", "TanggalAntrian"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama", "email", "nomorTelepon"],
                            },
                            {
                                model: JenisPerbaikan,
                            },
                        ],
                    },
                    {
                        model: Status,
                        attributes: ["status"],
                    },
                    {
                        model: Komplain,
                        attributes: ["idPelanggan", "komplain"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama", "email"],
                            },
                        ],
                    },
                ],
            });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "yogimasaji01@gmail.com",
                    pass: "hbvlbgcfvzbnydkt",
                },
            });

            const antrianData = perbaikanData.Antrian;
            const user = antrianData.User;

            const templatePath = path.join(__dirname, "../views/email.ejs");
            const emailTemplate = await ejs.renderFile(templatePath, {
                kodePerbaikan,
                user: user,
                id: perbaikanData.id,
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: "Kode Perbaikan Anda",
                html: emailTemplate,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });

            // Create status entry
            const statusCreate = await Status.create({
                idPerbaikan: perbaikan.id,
                status: status,
            });

            res.status(201).json(
                perbaikanData
                // statusCreate,
            );
        } catch (error) {
            next(error);
            console.log(error);
        }
    }

    static async getMonthlyPerbaikan(req, res, next) {
        try {
            const perbaikanData = await PerbaikanNew.findAll({
                include: [
                    {
                        model: teknisi,
                        attributes: ["nama"],
                    },
                    {
                        model: Antrian,
                        attributes: ["idPelanggan", "TanggalAntrian"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama"],
                            },
                            {
                                model: JenisPerbaikan,
                            },
                        ],
                    },
                    {
                        model: Status,
                        attributes: ["status"],
                    },
                    {
                        model: Komplain,
                        attributes: ["idPelanggan", "komplain"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama", "email"],
                            },
                        ],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });

            const monthlyData = {};
            let key = 1;
            perbaikanData.forEach((perbaikan, index) => {
                const createdAt = new Date(perbaikan.createdAt);
                const monthYear = createdAt.toLocaleString("id-ID", {
                    month: "long",
                    year: "numeric",
                });

                if (!monthlyData[monthYear]) {
                    monthlyData[monthYear] = {
                        "Data Perbaikan": [],
                        bulan: createdAt.toLocaleString("id-ID", {
                            month: "long",
                        }),
                        tahun: createdAt.getFullYear().toString(),
                        TotalBiaya: 0,
                        totalPerbaikan: 0,
                        key: index,
                        komplain: 0,
                    };
                }

                monthlyData[monthYear]["Data Perbaikan"].push(perbaikan);
                monthlyData[monthYear].TotalBiaya += perbaikan.biaya;
                monthlyData[monthYear].totalPerbaikan += 1;

                if (perbaikan.Komplains.length > 0) {
                    monthlyData[monthYear].komplain +=
                        perbaikan.Komplains.length;
                }
            });

            // Convert komplain field to "tidak ada" if it is zero
            Object.values(monthlyData).forEach((data) => {
                if (data.komplain === 0) {
                    data.komplain = "tidak ada";
                }
            });

            const responseData = {
                "Data Perbulan": Object.values(monthlyData),
            };

            res.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async getMonthlyPerbaikanByKey(req, res, next) {
        try {
            const perbaikanData = await PerbaikanNew.findAll({
                include: [
                    {
                        model: teknisi,
                        attributes: ["nama"],
                    },
                    {
                        model: Antrian,
                        attributes: ["idPelanggan", "TanggalAntrian"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama"],
                            },
                        ],
                    },
                    {
                        model: Status,
                        attributes: ["status"],
                    },
                    {
                        model: Komplain,
                        attributes: ["idPelanggan", "komplain"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama", "email"],
                            },
                        ],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });

            const monthlyData = {};

            perbaikanData.forEach((perbaikan, index) => {
                const createdAt = new Date(perbaikan.createdAt);
                const monthYear = createdAt.toLocaleString("id-ID", {
                    month: "long",
                    year: "numeric",
                });

                if (!monthlyData[monthYear]) {
                    monthlyData[monthYear] = {
                        "Data Perbaikan": [],
                        bulan: createdAt.toLocaleString("id-ID", {
                            month: "long",
                        }),
                        tahun: createdAt.getFullYear().toString(),
                        TotalBiaya: 0,
                        totalPerbaikan: 0,
                        komplain: 0,
                        key: index.toString(), // Convert the index to string for comparison
                    };
                }

                monthlyData[monthYear]["Data Perbaikan"].push(perbaikan);
                monthlyData[monthYear].TotalBiaya += perbaikan.biaya;
                monthlyData[monthYear].totalPerbaikan += 1;

                if (perbaikan.Komplains.length > 0) {
                    monthlyData[monthYear].komplain +=
                        perbaikan.Komplains.length;
                }
            });

            // Convert komplain field to "tidak ada" if it is zero
            Object.values(monthlyData).forEach((data) => {
                if (data.komplain === 0) {
                    data.komplain = "tidak ada";
                }
            });

            const { key } = req.params;

            const foundData = Object.values(monthlyData).find(
                (data) => data.key === key
            );

            if (foundData) {
                res.status(200).json(foundData);
            } else {
                res.status(404).json({ error: "Invalid key" });
            }
        } catch (error) {
            next(error);
        }
    }

    static async getMonthlyPerbaikanByMonth(req, res, next) {
        try {
            const { month, year } = req.query;

            const perbaikanData = await PerbaikanNew.findAll({
                include: [
                    {
                        model: teknisi,
                        attributes: ["nama"],
                    },
                    {
                        model: Antrian,
                        attributes: ["idPelanggan", "TanggalAntrian"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama"],
                            },
                        ],
                    },
                    {
                        model: Status,
                        attributes: ["status"],
                    },
                    {
                        model: Komplain,
                        attributes: ["idPelanggan", "komplain"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama", "email"],
                            },
                        ],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });

            const monthlyData = {};
            perbaikanData.forEach((perbaikan) => {
                const createdAt = new Date(perbaikan.createdAt);
                const perbaikanMonth = createdAt.toLocaleString("id-ID", {
                    month: "long",
                });
                const perbaikanYear = createdAt.getFullYear().toString();

                if (perbaikanMonth === month && perbaikanYear === year) {
                    if (!monthlyData[perbaikanYear]) {
                        monthlyData[perbaikanYear] = {};
                    }

                    if (!monthlyData[perbaikanYear][perbaikanMonth]) {
                        monthlyData[perbaikanYear][perbaikanMonth] = {
                            "Data Perbaikan": [],
                            "Total Biaya": 0,
                        };
                    }

                    monthlyData[perbaikanYear][perbaikanMonth][
                        "Data Perbaikan"
                    ].push(perbaikan);
                    monthlyData[perbaikanYear][perbaikanMonth]["Total Biaya"] +=
                        perbaikan.biaya;
                }
            });

            if (Object.keys(monthlyData).length === 0) {
                return res.status(200).json({
                    message:
                        "Belum ada perbaikan untuk bulan dan tahun yang diminta.",
                });
            }

            res.status(200).json({
                "Data Perbulan": monthlyData,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getNewPerbaikan(req, res, next) {
        try {
            const perbaikanData = await PerbaikanNew.findAll({
                include: [
                    {
                        model: teknisi,
                        attributes: ["nama"],
                    },
                    {
                        model: Antrian,
                        attributes: ["idPelanggan", "TanggalAntrian"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama"],
                            },
                            {
                                model: JenisPerbaikan,
                            },
                        ],
                    },
                    {
                        model: Status,
                        attributes: ["status"],
                    },
                    {
                        model: Komplain,
                        attributes: ["idPelanggan", "komplain"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama", "email"],
                            },
                        ],
                    },
                    {
                        model: Pembayaran,
                    },
                ],
                order: [["createdAt", "DESC"]],
            });

            res.status(200).json({
                "Data Perbaikan": perbaikanData,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUserPerbaikan(req, res, next) {
        const idPelanggan = req.user.id;
        try {
            const perbaikanData = await PerbaikanNew.findAll({
                include: [
                    {
                        model: teknisi,
                        attributes: ["nama"],
                    },
                    {
                        model: Antrian,
                        attributes: [
                            "idPelanggan",
                            "TanggalAntrian",
                            "id",
                            "idJenis",
                        ],
                        include: [
                            {
                                model: User,
                                attributes: ["nama", "email", "nomorTelepon"],
                                where: {
                                    id: idPelanggan,
                                },
                            },
                            {
                                model: JenisPerbaikan,
                            },
                        ],
                        where: {
                            idPelanggan,
                        },
                    },
                    {
                        model: Status,
                        attributes: ["status"],
                    },
                    {
                        model: Komplain,
                        attributes: ["idPelanggan", "komplain"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama", "email"],
                            },
                        ],
                    },
                    {
                        model: Pembayaran,
                    },
                ],
                order: [["createdAt", "DESC"]],
            });

            res.status(200).json({
                "Data Perbaikan": perbaikanData,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUserPerbaikanById(req, res, next) {
        const idPelanggan = req.user.id;
        const perbaikanId = req.params.perbaikanId;

        try {
            const perbaikanData = await PerbaikanNew.findOne({
                where: {
                    id: perbaikanId,
                },
                include: [
                    {
                        model: teknisi,
                        attributes: ["nama"],
                    },
                    {
                        model: Antrian,
                        attributes: ["idPelanggan", "TanggalAntrian"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama"],
                                where: {
                                    id: idPelanggan, // Filter by user ID
                                },
                            },
                            {
                                model: JenisPerbaikan,
                            },
                        ],
                    },
                    {
                        model: Status,
                        attributes: ["status", "createdAt"],
                        separate: true,
                        order: [["createdAt", "DESC"]],
                    },
                    {
                        model: Komplain,
                        attributes: ["idPelanggan", "komplain", "createdAt"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama", "email"],
                            },
                        ],
                    },
                    {
                        model: Pembayaran,
                    },
                ],
            });

            if (!perbaikanData || perbaikanData.Antrian === null) {
                return res.status(404).json({
                    message: "No data found for the user's Perbaikan.",
                });
            }

            res.status(200).json({
                "Data Perbaikan": perbaikanData,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getPerbaikan(req, res, next) {
        try {
            const perbaikanData = await Perbaikan.findAll({
                include: [
                    {
                        model: teknisi,
                        attributes: ["nama"],
                    },
                    {
                        model: pelanggan,
                        attributes: ["nama"],
                    },
                ],
            });

            res.status(200).json({
                "Data Perbaikan": perbaikanData,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getPerbaikanById(req, res, next) {
        const { id } = req.params; // Assuming the ID is passed as a URL parameter

        try {
            const perbaikanData = await PerbaikanNew.findOne({
                where: { id },
                include: [
                    {
                        model: teknisi,
                        attributes: ["nama"],
                    },
                    {
                        model: Antrian,
                        attributes: [
                            "idPelanggan",
                            "TanggalAntrian",
                            "idJenis",
                        ],
                        include: [
                            {
                                model: User,
                                attributes: ["nama"],
                            },
                            {
                                model: JenisPerbaikan,
                            },
                        ],
                    },
                    {
                        model: Status,
                        attributes: ["id", "status", "createdAt"],
                    },
                    {
                        model: Komplain,
                        attributes: ["idPelanggan", "komplain"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama", "email"],
                            },
                        ],
                    },
                    { model: Pembayaran },
                ],
            });

            if (!perbaikanData) {
                return res.status(404).json({ error: "Perbaikan not found" });
            }
            perbaikanData.Statuses.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );

            res.status(200).json({
                "Data Perbaikan": perbaikanData,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getPerbaikanByKodePerbaikan(req, res, next) {
        const kode = req.params.kode;
        try {
            const perbaikanData = await Perbaikan.findOne({
                where: {
                    kodePerbaikan: kode,
                },
                include: [pelanggan, teknisi],
            });
            res.status(200).json({ perbaikanData });
        } catch (error) {
            next(error);
        }
    }
    static async getByKodePerbaikan(req, res, next) {
        const { kodePerbaikan } = req.params;

        try {
            const perbaikanData = await PerbaikanNew.findOne({
                where: { kodePerbaikan },
                include: [
                    {
                        model: teknisi,
                        attributes: ["nama"],
                    },
                    {
                        model: Antrian,
                        attributes: [
                            "idPelanggan",
                            "TanggalAntrian",
                            "idJenis",
                        ],
                        include: [
                            {
                                model: User,
                                attributes: ["nama"],
                            },
                            {
                                model: JenisPerbaikan,
                            },
                        ],
                    },
                    {
                        model: Status,
                        attributes: ["status"],
                    },
                    {
                        model: Komplain,
                        attributes: ["idPelanggan", "komplain"],
                        include: [
                            {
                                model: User,
                                attributes: ["nama", "email"],
                            },
                        ],
                    },
                ],
            });

            if (!perbaikanData) {
                return res
                    .status(404)
                    .json({ message: "Data perbaikan not found" });
            }

            res.status(200).json({
                "Data Perbaikan": perbaikanData,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updatePerbaikan(req, res, next) {
        try {
            const id = req.params.id;
            const { biaya, kendala, perangkat, status } = req.body;

            const perbaikanDataUpdated = await PerbaikanNew.findOne({
                where: { id },
                include: [
                    {
                        model: Antrian,
                        include: [
                            {
                                model: User,
                                attributes: ["nama", "email"],
                            },
                        ],
                    },
                ],
            });

            if (status === "Selesai") {
                const user = perbaikanDataUpdated.Antrian.User;

                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "yogimasaji01@gmail.com",
                        pass: "hbvlbgcfvzbnydkt",
                    },
                });

                const templatePath = path.join(
                    __dirname,
                    "../views/emailselesai.ejs"
                );
                const emailTemplate = await ejs.renderFile(templatePath, {
                    kodePerbaikan: perbaikanDataUpdated.kodePerbaikan,
                    user: user,
                    id: id,
                });

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: user.email,
                    subject: "Perbaikan Selesai",
                    html: emailTemplate,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });
            }

            await PerbaikanNew.update(
                { biaya, kendala, perangkat, status },
                {
                    where: {
                        id,
                    },
                }
            );

            res.status(200).json({ perbaikanDataUpdated });
        } catch (error) {
            console.log(error);
        }
    }

    static async deletePerbaikan(req, res, next) {
        try {
            const id = req.params.id;
            const perbaikanData = await PerbaikanNew.findOne({
                where: { id },
                include: [Status, Komplain, Pembayaran],
            });

            if (!perbaikanData) {
                return res.status(404).json({
                    message: "Perbaikan not found.",
                });
            }
            await perbaikanData.Statuses.forEach(async (status) => {
                await status.destroy();
            });
            await perbaikanData.Komplains.forEach(async (Komplain) => {
                await Komplain.destroy();
            });
            await perbaikanData.Pembayarans.forEach(async (Pembayaran) => {
                await Pembayaran.destroy();
            });
            await perbaikanData.destroy();

            res.status(200).json({
                message: "Perbaikan deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    }

    static async chartPerbaikan(req, res, next) {
        try {
            // Get all PerbaikanNew data
            const perbaikanData = await PerbaikanNew.findAll();

            // Create an object to store the total biaya for each month
            const totalBiayaPerMonth = {};

            // Calculate the total biaya for each PerbaikanNew and sum them up for each month
            perbaikanData.forEach((perbaikan) => {
                const { createdAt, biaya } = perbaikan;
                const monthYear = createdAt.toISOString().slice(0, 7); // Get the year and month (YYYY-MM)

                if (totalBiayaPerMonth[monthYear]) {
                    totalBiayaPerMonth[monthYear] += biaya;
                } else {
                    totalBiayaPerMonth[monthYear] = biaya;
                }
            });

            // Convert the totalBiayaPerMonth object into an array of objects
            const chartData = Object.keys(totalBiayaPerMonth).map(
                (monthYear) => ({
                    month: monthYear,
                    totalBiaya: totalBiayaPerMonth[monthYear],
                })
            );

            res.status(200).json({
                "Chart Perbaikan": chartData,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PerbaikanController;
