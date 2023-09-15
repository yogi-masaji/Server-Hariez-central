"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Antrian, {
                foreignKey: "idPelanggan",
            });
            this.hasMany(models.Komplain, {
                foreignKey: "idPelanggan",
            });
            this.hasMany(models.Pembayaran, {
                foreignKey: "idPelanggan",
            });
            this.hasMany(models.PerbaikanNew, {
                foreignKey: "kodePerbaikan",
            });
        }
    }
    User.init(
        {
            nama: DataTypes.STRING,
            email: DataTypes.STRING,
            nomorTelepon: DataTypes.STRING,
            password: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
