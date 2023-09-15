"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Komplain extends Model {
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
    Komplain.init(
        {
            idPelanggan: DataTypes.UUID,
            idPerbaikan: DataTypes.UUID,
            komplain: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Komplain",
        }
    );
    return Komplain;
};
