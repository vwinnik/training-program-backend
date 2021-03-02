import models from '~/src/service_providers/sequelize/models'

export default {
  Mutation: {
    createUser: () => {
      return models.user.create()
    }
  }
}
