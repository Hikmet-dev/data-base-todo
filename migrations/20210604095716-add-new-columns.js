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
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('Tasks', 'user_id')
  }
};
