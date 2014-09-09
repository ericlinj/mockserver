/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {

    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
    tableName: "t_user"
  });
  return User;
};
