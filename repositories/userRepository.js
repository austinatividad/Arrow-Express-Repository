
import User from '../models/userdb.js';


class UserRepository {

  /**
   * Finds a user by their ID number.
   * @param {string} idNumber - The ID number of the user to find.
   * @param {object} projection - The fields to project in the query.
   * @returns {Promise<object>} The user object if found, null otherwise.
   */
  static async findById(idNumber, projection = null) {
    try {
      return await User.findOne({ idNumber }, projection);
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw new Error("Database query failed");
    }
  }

  static async findAdminById(idNumber, projection = null) { 
    try {
      return await Admin.findOne({ idNumber }, projection);
    } catch (error) {
      console.error("Error finding admin by ID:", error);
      throw new Error("Database query failed");
    }
  }


}

export default UserRepository