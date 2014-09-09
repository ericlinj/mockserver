/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mock_project', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: "mock_project"
  });
};
