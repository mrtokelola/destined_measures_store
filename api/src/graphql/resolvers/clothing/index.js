import {
  getClothingById,
  listClothes,
} from "../../../services/clothingService.js";

const index = {
  Query: {
    clothing: async (_parent, { id }, { models }) => {
      return getClothingById(id, models.Clothing);
    },

    clothes: async (_parent, { page = 1, limit = 6, sort }, { models }) => {
      return listClothes(models.Clothing, { page, limit, sort });
    },
  },

  Mutation: {
    createClothing: async (_parent, args, { models }) => {
      return models.Clothing.create(args);
    },
  },
};

export default index;