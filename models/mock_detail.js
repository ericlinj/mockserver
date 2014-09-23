/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var mock_detail = sequelize.define('mock_detail', {
    url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    para_json: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    result_json: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mock_json: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    timeout: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_mock: {
      type: DataTypes.INTEGER(2),
      allowNull: true,
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    upadate_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    project_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: "mock_detail",
    associate: function(models) {
      mock_detail.belongsTo(models.mock_project, {
        foreignKey: 'project_id'
      });
    }
  });
  return mock_detail
};
