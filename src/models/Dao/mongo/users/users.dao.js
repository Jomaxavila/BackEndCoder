import userModel from "../../../schemas/usersModel.js";

export default class UsersDAO {
  async er(data) {
    try {
      const response = await userModel.create(data);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserByEmail(email) {
    try {
      const response = await userModel.findOne({ email }).lean();
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUsers() {
    try {
      const users = await userModel.find().lean();
      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
