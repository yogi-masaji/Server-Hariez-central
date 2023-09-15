"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
        );
        await queryInterface.createTable("PerbaikanNews", {
            id: {
                allowNull: false,
                type: Sequelize.DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.literal("uuid_generate_v4()"),
            },
            kodePerbaikan: {
                type: Sequelize.STRING,
                references: {
                    model: {
                        tableName: "Antrians",
                    },
                    key: "id",
                },
            },
            idTeknisi: {
                type: Sequelize.UUID,
                references: {
                    model: {
                        tableName: "teknisis",
                    },
                    key: "id",
                },
            },
            biaya: {
                type: Sequelize.FLOAT,
            },
            kendala: {
                type: Sequelize.STRING,
            },
            perangkat: {
                type: Sequelize.STRING,
            },
            status: {
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
        await queryInterface.dropTable("PerbaikanNews");
    },
};
