"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Pembayaran extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.PerbaikanNew, {
                foreignKey: "idPerbaikan",
            });
            this.belongsTo(models.User, {
                foreignKey: "idPelanggan",
            });
        }
    }
    Pembayaran.init(
        {
            idPerbaikan: DataTypes.STRING,
            idPelanggan: DataTypes.STRING,
            image: DataTypes.STRING,
            status: DataTypes.STRING,
            metodePembayaran: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Pembayaran",
        }
    );
    return Pembayaran;
};
