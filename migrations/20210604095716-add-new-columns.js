'use strict';

// const user = require("../models/user");
// const User = user();
module.exports = {
  up: async (queryInterface, DataTypes) => {
   await queryInterface.addColumn('Tasks', 'user_id', {
    allowNull: false,  
    type: DataTypes.UUID,     
  }, {
    after: 'id'
 });
 await queryInterface.addConstraint('Tasks', {
  fields: ['user_id'],
  type: 'foreign key',
  name: 'custom_fkey_constraint_user_id',
  references: { 
    table: 'Users',
    field: 'id'
  },
  onDelete: 'cascade',
  onUpdate: 'cascade'
 })
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('Tasks', 'user_id')
  }
};
