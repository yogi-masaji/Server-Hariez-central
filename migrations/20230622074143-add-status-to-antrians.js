"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("Antrians", "status", {
            type: Sequelize.STRING,
            allowNull: true, // Update the value according to your requirement
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Antrians", "status");
    },
};
