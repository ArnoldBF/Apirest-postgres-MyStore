// const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class OrderService {
  constructor() {}
  async create(data) {
    const newOrder = await models.Order.create(data);
    return {
      newOrder,
    };
  }

  async addItem(data) {
    const newItem = await models.OrderProduct.create(data);
    return newItem;
  }

  async find() {
    const orders = await models.Order.findAll({
      include: ['customer'],
    });
    return {
      orders,
    };
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
        'items',
      ],
    });
    return order;
  }

  async update(id, changes) {
    const order = await this.findOne(id);
    const updateOrder = await order.update(changes);

    return {
      updateOrder,
    };
  }

  async delete(id) {
    const order = await this.findOne(id);
    await order.destroy();
    return {
      message: 'Order deleted successfully',
      id,
    };
  }

  async findByUser(userId) {
    const orders = await models.Order.findAll({
      include: [
        {
          association: 'customer',
          include: ['user'],
          where: {
            userId,
          },
        },
      ],
    });
    return orders;
  }
}

module.exports = OrderService;
