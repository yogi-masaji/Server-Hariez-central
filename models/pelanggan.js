'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pelanggan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Perbaikan, {
        foreignKey: "idPelanggan",
      })
    }
  }
  pelanggan.init({
    nama: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Nama teknisi tidak boleh kosong!'
        }
      }
    },
    nomorTelepon: {
      type: DataTypes.STRING,
      // unique: {
      //   args: true,
      //   msg: "nomor telepon ini sudah digunakan"
      // },
      validate: {
        isNumeric: {
          args: true,
          msg: 'Nomor telepon teknisi tidak sesuai!'
        },
        notEmpty: {
          args: true,
          msg: 'Nomor telepon teknisi tidak boleh kosong!'
        },
        // isUnique(value, next) {
        //   teknisi.findOne({ where: { nomor_telepon: value } }).then((teknisiData) => {
        //     if (teknisiData) {
        //       return next('Nomor telepon ini sudah digunakan');
        //     }
        //     return next();
        //   });
        // },
      }
    },
    email:{
      type: DataTypes.STRING,
      // unique: {
      //   args: true,
      //   msg: 'email ini sudah digunakan'
      // },
      validate: {
        isEmail: {
          args: true,
          msg: 'Format email tidak sesuai!'
        },
        notEmpty: {
          args: true,
          msg: 'Email teknisi tidak boleh kosong!'
        },
        // isUnique(value, next) {
        //   teknisi.findOne({ where: { email: value } }).then((teknisiData) => {
        //     if (teknisiData) {
        //       return next('email ini sudah digunakan');
        //     }
        //     return next();
        //   });
        // },
      }
    } 
  }, {
    sequelize,
    modelName: 'pelanggan',
  });
  return pelanggan;
};