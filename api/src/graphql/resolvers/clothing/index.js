import merge from "lodash.merge";
import { getClothingById, listClothes, getClothesFilters } from "../../../services/clothingService.js";
import decreaseInventoryResolvers from "./decreaseInventoryResolvers.js";
import orderResolvers from "../orders/index.js";
import increaseInventoryResolvers from "./increaseInventoryResolvers.js";
import createClothingResolvers from "./createClothingResolvers.js";
import updateClothingResolvers from "./updateClothingResolvers.js";
import deleteClothingResolvers from "./deleteClothingResolvers.js";
import reserveInventoryResolvers from "./reserveInventoryResolvers.js";
import releaseReservedInventoryResolvers from "./releaseReservedInventoryResolvers.js";

const clothingResolvers = {
  Query: {
    clothing: async (_parent, { id }, { db }) => {
      return getClothingById(id, db.Clothing);
    },

    clothes: async (_parent, { page = 1, limit = 6, sort, filter }, { db }) => {
      return listClothes(db.Clothing, { page, limit, sort, filter });
    },

    clothesFilters: async (_parent, _args, { db }) => {
      return getClothesFilters(db.Clothing);
    },
  },
};

const resolvers = {};

export default merge(
  resolvers,
  clothingResolvers,
  decreaseInventoryResolvers,
  increaseInventoryResolvers,
  createClothingResolvers,
  updateClothingResolvers,
  reserveInventoryResolvers,
  releaseReservedInventoryResolvers,
  deleteClothingResolvers,
  orderResolvers
);
