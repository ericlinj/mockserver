/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mock_detail', {
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
    mock_json: {
      type: DataTypes.TEXT,
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
    tableName: "mock_detail"
  });
};
