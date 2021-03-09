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
    logInUser: (email, password) => {
      var pass = models.user.generateHash(password);
      return models.user.find(user => user.email === email && user.password === pass);
    },
    users: () => {
      return models.users.findAll();
    }
  }
}
