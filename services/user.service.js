// const boom = require('@hapi/boom');
// const pool = require('../libs/postgres.pool');
const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

const bcrypt = require('bcrypt');

class UserService {
  constructor() {}

  async create(data) {
    // const email = await models.User.findOne({ email: data.email });

    // if (email) {
    //   throw boom.badRequest('Email already exists');
    // }

    const { password } = data;

    const hash = await bcrypt.hash(password, 10);
    data.password = hash;

    const newUser = await models.User.create(data);
    delete newUser.dataValues.password;

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

    if (changes.password) {
      const hash = await bcrypt.hash(changes.password, 10);
      changes.password = hash;
    }

    const updateUser = await user.update(changes);
    delete updateUser.dataValues.password;
    return updateUser;
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
  async findByEmail(email) {
    const emailRes = await models.User.findOne({ where: { email: email } });

    return emailRes;
  }
}

module.exports = UserService;
