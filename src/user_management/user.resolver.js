import models from '~/src/service_providers/sequelize/models'

export default {
  Mutation: {
    createUser: (_,{input}) => {
     return models.user.create({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: input.password
      })
    }
  },
  Query: {
      logInUser: async (email, password) => {
        const user = await models.user.findOne({ where: { email } })
        
        if (!await user?.validatePassword(password, user.password)) {
          throw new Error('Invalid email or password')
        }
        
        return user
      },
      users: () => {
        return models.user.findAll()
      },
      currentUser: () => {
        return models.user.findOne()
      }
    }
  }
