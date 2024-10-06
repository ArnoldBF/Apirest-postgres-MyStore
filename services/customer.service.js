const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('../libs/sequelize');

class CustomerService {
  constructor() {}

  async find() {
    const customer = await models.Customer.findAll({
      include: ['user'],
    });
    return { customer };
  }

  async findOneForId(id) {
    const customer = await models.Customer.findByPk(id);
    if (!customer) {
      throw boom.notFound('Customer not found');
    }
    return customer;
  }

  async create(data) {
    // const { id } = await models.User.create(data.user);
    // const newCustomer = await models.Customer.create({
    //   ...data,
    //   userId: id,
    // });
    const hash = await bcrypt.hash(data.user.password, 10);
    const newData = {
      ...data,
      user: {
        ...data.user,
        password: hash,
      },
    };
    const newCustomer = await models.Customer.create(newData, {
      include: ['user'],
    });

    return newCustomer;
  }
  async update(id, changes) {
    const customer = await this.findOneForId(id);

    if (!customer) {
      throw boom.notFound('Customer not found');
    }

    const updateCustomer = await customer.update(changes);
    return { updateCustomer };
  }
  async delete(id) {
    const customer = await this.findOneForId(id);
    if (!customer) {
      throw boom.notFound('Customer not found');
    }
    await customer.destroy();

    return {
      message: 'Customer deleted successfully',
      id,
    };
  }
}

module.exports = CustomerService;
