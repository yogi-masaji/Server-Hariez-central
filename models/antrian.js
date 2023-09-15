"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Antrian extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                foreignKey: "idPelanggan",
            });
            this.hasMany(models.PerbaikanNew, {
                foreignKey: "kodePerbaikan",
            });
            this.belongsTo(models.JenisPerbaikan, {
                foreignKey: "idJenis",
            });
        }
    }
    Antrian.init(
        {
            idPelanggan: DataTypes.STRING,
            NoAntrian: DataTypes.STRING,
            TanggalAntrian: DataTypes.DATE,
            status: DataTypes.STRING,
            idJenis: DataTypes.INTEGER,
            kendala: DataTypes.STRING,
            alamatJemput: DataTypes.STRING,
            metodePengantaran: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Antrian",
        }
    );

    return Antrian;
};
