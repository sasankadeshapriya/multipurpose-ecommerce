'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RolePermissions.init({
    RoleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    PermissionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Permissions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'RolePermissions',
  });
  return RolePermissions;
};