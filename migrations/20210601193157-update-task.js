'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
     await queryInterface.addColumn('Tasks', 'uuid', {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      });
      await queryInterface.changeColumn('Tasks', 'name', {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      });
      await queryInterface.changeColumn('Tasks', 'done', {
        type: DataTypes.BOOLEAN,
        defaultValue: DataTypes.BOOLEAN
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tasks', 'uuid');
     await queryInterface.changeColumn('Tasks', 'name', {
      type: Sequelize.STRING
     });
     await queryInterface.changeColumn('Tasks', 'done', {
      type: Sequelize.BOOLEAN
    });
  }
};
