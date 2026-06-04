// Stores all database models so they can be used throughout the application.
export default class DataSource {
  constructor({ models }) {
    this.models = models;
  }
}