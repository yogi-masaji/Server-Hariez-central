"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
        );
        await queryInterface.createTable("Komplains", {
            id: {
                allowNull: false,
                type: Sequelize.DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.literal("uuid_generate_v4()"),
            },
            idPerbaikan: {
                type: Sequelize.UUID,
                references: {
                    model: {
                        tableName: "PerbaikanNews",
                    },
                    key: "id",
                },
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
            komplain: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable("Komplains");
    },
};
