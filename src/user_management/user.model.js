import bcrypt from 'bcrypt'

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, { timestamps: false })

  User.Prototype.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9))
  }
  User.Prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.local.password)
  }
  
  return User
}
