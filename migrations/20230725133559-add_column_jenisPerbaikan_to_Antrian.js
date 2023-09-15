"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("Antrians", "idJenis", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: {
                    tableName: "JenisPerbaikans", // Replace with the actual table name
                },
                key: "id", // Replace with the actual primary key of the referenced table
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Antrians", "jenisPerbaikan");
    },
};
