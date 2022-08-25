'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.message.belongsTo(models.user,{
        foreignKey: {
          name: 'userid'
        }
      });
    }
  }
  message.init({
    userid: DataTypes.INTEGER,
    titre: DataTypes.STRING,
    content: DataTypes.STRING,
    attachement: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'message',
  });
  return message;
};