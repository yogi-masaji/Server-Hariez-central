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
} = require("../models/index");
const path = require("path");
const cloudinary = require("../helpers/cloudinary");

class PembayaranController {
    static async createPembayaran(req, res, next) {
        const idPelanggan = req.user.id;
        const { idPerbaikan, metodePembayaran } = req.body;
        const status = "konfirmasi pembayaran"; // Set the status as "konfirmasi pembayaran"

        try {
            let image = null;
            if (metodePembayaran === "transfer") {
                // Jika metode pembayaran adalah transfer dan memerlukan file upload gambar
                image = req.file;
            }

            let image_url = null;
            if (image) {
                const result = await cloudinary.uploader.upload(image.path, {
                    public_id: `${idPelanggan}/${image.originalname}`,
                    resource_type: "auto",
                    folder: "pembayaran",
                    data: image.buffer,
                });
                image_url = result.secure_url;
            }

            const pembayaranCreate = await Pembayaran.create({
                idPelanggan,
                idPerbaikan,
                status,
                metodePembayaran,
                image: image_url,
            });

            res.status(201).json(pembayaranCreate);
        } catch (error) {
            console.log(error);
        }
    }

    static async getAllPembayaran(req, res, next) {
        try {
            const dataPembayaran = await Pembayaran.findAll({
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
                order: [["createdAt", "DESC"]],
            });

            res.status(200).json({
                "Data Pembayaran": dataPembayaran,
            });
        } catch (error) {
            next(error);
        }
    }
    static async getPembayaranById(req, res, next) {
        try {
            const { idPembayaran } = req.params;
            const dataPembayaran = await Pembayaran.findOne({
                where: { id: idPembayaran },
                include: [
                    {
                        model: User,
                    },
                    {
                        model: PerbaikanNew,
                    },
                ],
            });
            if (!dataPembayaran) {
                return res
                    .status(404)
                    .json({ message: "Pembayaran not found" });
            }
            res.status(200).json({
                "Data Pembayaran": dataPembayaran,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUserPembayaran(req, res, next) {
        const idPelanggan = req.user.id;
        try {
            const pembayaran = await Pembayaran.findAll({
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
                    },
                ],
            });

            res.status(200).json({ pembayaran });
        } catch (error) {
            console.log(error);
        }
    }

    static async updatePembayaran(req, res, next) {
        const { idPembayaran } = req.params;
        const image = req.file; // Assuming you're using req.file to handle file uploads

        try {
            const pembayaran = await Pembayaran.findByPk(idPembayaran);
            if (!pembayaran) {
                return res
                    .status(404)
                    .json({ message: "Pembayaran not found" });
            }

            // Delete the old image from Cloudinary
            const publicId = pembayaran.image.substring(
                pembayaran.image.lastIndexOf("/") + 1,
                pembayaran.image.lastIndexOf(".")
            );
            await cloudinary.uploader
                .destroy(`pembayaran/${pembayaran.idPelanggan}/${publicId}`)
                .catch((err) => {
                    console.log(err);
                });

            // Upload the new image to Cloudinary
            const result = await cloudinary.uploader.upload(image.path, {
                folder: `pembayaran/${pembayaran.idPelanggan}`,
            });

            // Update the new image URL in the database
            pembayaran.image = result.secure_url;
            await pembayaran.save();

            res.status(200).json({ message: "Pembayaran updated" });
        } catch (error) {
            next(error);
        }
    }

    static async konfirmasiPembayaran(req, res, next) {
        const { id } = req.params;
        const { status } = req.body;

        try {
            const pembayaran = await Pembayaran.findOne({
                where: {
                    id,
                },
            });

            if (!pembayaran) {
                return res
                    .status(404)
                    .json({ message: "Pembayaran not found." });
            }

            // Only allow updating the status field
            await pembayaran.update({
                status,
            });

            res.status(200).json(pembayaran);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Failed to update Pembayaran status.",
            });
        }
    }

    static async deletePembayaran(req, res, next) {
        const { idPembayaran } = req.params;
        try {
            const pembayaran = await Pembayaran.findByPk(idPembayaran);
            if (!pembayaran) {
                return res
                    .status(404)
                    .json({ message: "Pembayaran not found" });
            }

            if (pembayaran.image) {
                const publicId = pembayaran.image.substring(
                    pembayaran.image.lastIndexOf("/") + 1,
                    pembayaran.image.lastIndexOf(".")
                );
                await cloudinary.uploader
                    .destroy(`pembayaran/${pembayaran.idPelanggan}/${publicId}`)
                    .catch((err) => {
                        console.log(err);
                    });
            }

            await pembayaran.destroy();
            res.status(200).json({ message: "Pembayaran deleted" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PembayaranController;
