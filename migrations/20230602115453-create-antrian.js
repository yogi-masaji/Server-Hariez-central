"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Antrians", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            idPelanggan: {
                type: Sequelize.UUID,
                references: {
                    model: {
                        tableName: "Users",
                    },
                    key: "id",
                },
            },
            NoAntrian: {
                type: Sequelize.STRING,
            },
            TanggalAntrian: {
                type: Sequelize.DATE,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Antrians");
    },
};
