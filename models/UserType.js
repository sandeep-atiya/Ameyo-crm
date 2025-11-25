import { DataTypes } from 'sequelize';

// Sequelize model for existing MSSQL table `UserType`.
export default (sequelize, DataTypesLocal = DataTypes) => {
  const UserType = sequelize.define('UserType', {
    ID: {
      type: DataTypesLocal.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'ID'
    },
    UserTypeText: {
      type: DataTypesLocal.STRING(30),
      allowNull: false,
      field: 'UserTypeText'
    },
    CreatedByID: { type: DataTypesLocal.BIGINT, allowNull: true, field: 'CreatedByID' },
    StatusID: { type: DataTypesLocal.INTEGER, allowNull: false, field: 'StatusID' },
    CreatedDate: { type: DataTypesLocal.DATEONLY, allowNull: true, field: 'CreatedDate' },
    CreatedTime: { type: DataTypesLocal.TIME, allowNull: true, field: 'CreatedTime' },
    UpdatedDate: { type: DataTypesLocal.DATEONLY, allowNull: true, field: 'UpdatedDate' },
    UpdatedTime: { type: DataTypesLocal.TIME, allowNull: true, field: 'UpdatedTime' }
  }, {
    tableName: 'UserType',
    timestamps: false
  });

  UserType.associate = (models) => {
    // UserType has many users (if desired)
    if (models.tblUser) {
      UserType.hasMany(models.tblUser, { foreignKey: 'UserTypeID', as: 'users' });
    }
  };

  return UserType;
};
