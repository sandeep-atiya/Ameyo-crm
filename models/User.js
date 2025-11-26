import { DataTypes } from 'sequelize';

// Model mapping for existing MSSQL table `tblUser` from your database.
// Column names are preserved (uID, uname, upassword, etc.) so Sequelize
// reads/writes to the existing table correctly.
export default (sequelize, DataTypesLocal = DataTypes) => {
  const User = sequelize.define(
    'tblUser',
    {
      uID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'uID',
      },
      uname: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'uname',
      },
      upassword: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'upassword',
      },
      UserTypeID: { type: DataTypes.INTEGER, allowNull: true, field: 'UserTypeID' },
      StatusID: { type: DataTypes.INTEGER, allowNull: true, field: 'StatusID' },
      CreatedByID: { type: DataTypes.BIGINT, allowNull: true, field: 'CreatedByID' },
      CreatedDate: { type: DataTypes.DATEONLY, allowNull: true, field: 'CreatedDate' },
      CreatedTime: { type: DataTypes.TIME, allowNull: true, field: 'CreatedTime' },
      UpdatedDate: { type: DataTypes.DATEONLY, allowNull: true, field: 'UpdatedDate' },
      UpdatedTime: { type: DataTypes.TIME, allowNull: true, field: 'UpdatedTime' },
      ManualSales: { type: DataTypes.INTEGER, allowNull: true, field: 'ManualSales' },
      ProPicture: { type: DataTypes.STRING(200), allowNull: true, field: 'ProPicture' },
      TeamLeader: { type: DataTypes.INTEGER, allowNull: true, field: 'TeamLeader' },
      Complaints: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'Complaints',
      },
      Appointment: { type: DataTypes.INTEGER, allowNull: true, field: 'Appointment' },
      SalesAgent: { type: DataTypes.INTEGER, allowNull: true, field: 'SalesAgent' },
      Doctors: { type: DataTypes.INTEGER, allowNull: true, field: 'Doctors' },
      FilterationNC: { type: DataTypes.INTEGER, allowNull: true, field: 'FilterationNC' },
      Task: { type: DataTypes.INTEGER, allowNull: true, field: 'Task' },
      NDR: { type: DataTypes.INTEGER, allowNull: true, field: 'NDR' },
      VerificationNonContacts: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'VerificationNonContacts',
      },
      PasswordUpdate: { type: DataTypes.DATE, allowNull: true, field: 'PasswordUpdate' },
      AdminType: { type: DataTypes.BOOLEAN, allowNull: true, field: 'AdminType' },
    },
    {
      tableName: 'tblUser',
      timestamps: false,
    }
  );

  // Associations will be attached in models/index.js after all models are loaded
  User.associate = (models) => {
    if (models.UserType) {
      User.belongsTo(models.UserType, { foreignKey: 'UserTypeID', as: 'userType' });
    }
  };

  return User;
};
