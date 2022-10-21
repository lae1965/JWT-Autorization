import { DataTypes } from 'sequelize';

import { sequelize } from '../db.js';

export const User = sequelize.define('User', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: DataTypes.STRING, unique: true, allowNull: false},
  password: {type: DataTypes.STRING, allowNull: false},
}, {
  tymestamps: false
}
);

export const Token = sequelize.define('Token', {
  refresh: {type: DataTypes.STRING, allowNull: false}
});

User.hasOne(Token);
Token.belongsTo(User);