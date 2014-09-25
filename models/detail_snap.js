/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var detail_snap = sequelize.define('detail_snap', {
    detail_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    creater: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: "detail_snap",
    associate: function(models) {
      detail_snap.belongsTo(models.mock_detail, {
        foreignKey: 'detail_id'
      });
    }
  });
  return detail_snap
};
