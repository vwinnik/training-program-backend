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

  User.prototype.validatePassword = async function(password, userPassword) {
    return await bcrypt.compare(password, userPassword)
  }

  User.beforeCreate(async user => {
    user.password = await user.generateHash(user)
  })
  
  User.prototype.generateHash = async function(user) {
      const saltRounds = 10
      return await bcrypt.hash(user.password, saltRounds)
  }

  return User
}
