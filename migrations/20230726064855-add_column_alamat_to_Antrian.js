"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("Antrians", "alamatJemput", {
            type: Sequelize.STRING,
            allowNull: true, // Update the value according to your requirement
        });

        await queryInterface.addColumn("Antrians", "kendala", {
            type: Sequelize.STRING,
            allowNull: true, // Update the value according to your requirement
        });

        await queryInterface.addColumn("Antrians", "metodePengantaran", {
            type: Sequelize.STRING,
            allowNull: true, // Update the value according to your requirement
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Antrians", "kendala");
        await queryInterface.removeColumn("Antrians", "alamatJemput");
        await queryInterface.removeColumn("Antrians", "metodePengantaran");
    },
};
