'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Perbaikan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.pelanggan, {
        foreignKey: "idPelanggan",
      })
      this.belongsTo(models.teknisi, {
        foreignKey: "idTeknisi",
      })
    }
  }
  Perbaikan.init({
    idPelanggan: DataTypes.UUID,
    kodePerbaikan: DataTypes.STRING,
    idTeknisi: DataTypes.UUID,
    deskripsiPerangkat: DataTypes.STRING,
    kendala: DataTypes.STRING,
    biaya: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Perbaikan',
  });
  return Perbaikan;
};