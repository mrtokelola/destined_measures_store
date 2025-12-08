import UserData from '../data/UserData.js'
import ClothingData from '../schema/ClothesData.js'

const resolvers = {
  Query: {
    users() {
      return UserData;
    },
    clothings() {
      return ClothingData;
    }
  }
}

export default resolvers;