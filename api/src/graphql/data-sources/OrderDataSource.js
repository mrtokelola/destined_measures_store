import DataSource from "./DataSource.js";

export default class OrderDataSource extends DataSource {
  async createOrder({ customer, items, total }) {
    return this.models.Order.create({
      customer,
      items,
      total,
    });
  }

  async getOrderById(id) {
    return this.models.Order.findById(id);
  }
}