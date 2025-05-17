import User from "../models/User.js";

export default class UserService {
  static async createUser(username, displayName, email, password) {
    return await User.create({ username, displayName, email, password });
  }

  static async findUserById(userId) {
    const user = await User.findOne({
      _id: userId,
      accountStatus: {
        $ne: "DELETE",
      },
    });

    return user;
  }

  static async findUserByEmail(email) {
    const user = await User.findOne({
      email,
      accountStatus: {
        $ne: "DELETE",
      },
    });

    return user;
  }
}
