// const boom = require('@hapi/boom');
// const pool = require('../libs/postgres.pool');
const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class UserService {
  constructor() {}

  async create(data) {
    // const email = await models.User.findOne({ email: data.email });

    // if (email) {
    //   throw boom.badRequest('Email already exists');
    // }
    const newUser = await models.User.create(data);

    return newUser;
  }

  async find() {
    const user = await models.User.findAll({
      include: ['customer'],
    });
    return user;
  }

  async findOneForId(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('User not found');
    }
    return user;
  }

  async update(id, changes) {
    const user = await this.findOneForId(id);

    if (!user) {
      throw boom.notFound('User not found');
    }

    const updateUSer = await user.update(changes);
    return updateUSer;
  }

  async delete(id) {
    const user = await this.findOneForId(id);
    if (!user) {
      throw boom.notFound('User not found');
    }
    await user.destroy();

    return {
      message: 'User deleted successfully',
      id,
    };
  }
}

module.exports = UserService;
