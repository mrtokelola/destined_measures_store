import { getClothingById, listClothes, getClothesFilters } from "../../../services/clothingService.js";

const index = {
  Query: {
    clothing: async (_parent, { id }, { models }) => {
      return getClothingById(id, models.Clothing);
    },

    clothes: async (_parent, { page = 1, limit = 6, sort, filter }, { models }) => {
      return listClothes(models.Clothing, { page, limit, sort, filter });
    },

    clothesFilters: async (_parent, _args, { models }) => {
      return getClothesFilters(models.Clothing);
    },
  },

  Mutation: {
    createClothing: async (_parent, args, { models }) => {
      return models.Clothing.create(args);
    },
  },
};

export default index;