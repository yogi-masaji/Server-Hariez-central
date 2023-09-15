"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PerbaikanNew extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            this.belongsTo(models.Antrian, {
                foreignKey: "kodePerbaikan",
            });
            this.belongsTo(models.teknisi, {
                foreignKey: "idTeknisi",
            });
            this.hasMany(models.Status, {
                foreignKey: "idPerbaikan",
            });
            this.hasMany(models.Komplain, {
                foreignKey: "idPerbaikan",
            });
            this.hasMany(models.Pembayaran, {
                foreignKey: "idPerbaikan",
            });
        }
    }
    PerbaikanNew.init(
        {
            kodePerbaikan: DataTypes.STRING,
            idTeknisi: DataTypes.STRING,
            biaya: DataTypes.FLOAT,
            kendala: DataTypes.STRING,
            perangkat: DataTypes.STRING,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "PerbaikanNew",
        }
    );
    return PerbaikanNew;
};
