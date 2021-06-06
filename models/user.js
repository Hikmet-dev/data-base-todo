'use strict';
const {Model} = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Task, {as: "Task" , foreignKey: 'user_id' });
    }
  }; 
  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    firstName:{
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password:{
      type: DataTypes.STRING(),
      allowNull: false,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 7))
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    freezeTableName: true
  });
  return User;
};