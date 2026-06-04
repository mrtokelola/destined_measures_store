import DataSource from "./DataSource.js";

export default class OrderDataSource extends DataSource {
  // Creates and saves a new order to the database.
  async createOrder({ customer, items, total }) {
    return this.models.Order.create({
      customer,
      items,
      total,
    });
  }

  // Find an order by ID.
  async getOrderById(id) {
    return this.models.Order.findById(id);
  }
}