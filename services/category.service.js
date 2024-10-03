const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class CategoryService {
  constructor() {}

  async create(data) {
    const newCategory = await models.Category.create(data);
    return newCategory;
  }

  async find() {
    const categories = await models.Category.findAll();
    if (!categories) {
      throw boom.notFound('categories not found');
    }
    return categories;
  }

  async findOne(id) {
    const category = await models.Category.findByPk(id, {
      include: ['products'],
    });
    if (!category) {
      {
        throw boom.notFound('category not found');
      }
    }

    return category;
  }

  async update(id, changes) {
    const category = await this.findOne(id);
    const updateCategory = await category.update(changes);
    return updateCategory;
  }

  async delete(id) {
    const category = await this.findOne(id);
    await category.destroy();
    return {
      message: 'Category deleted successfully',
      id,
    };
  }
}

module.exports = CategoryService;
