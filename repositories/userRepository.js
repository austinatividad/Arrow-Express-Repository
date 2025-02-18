
const User = require('../models/userdb.js');

const UserRepository = {

  /**
   * Finds a user by their ID number.
   * @param {string} idNumber - The ID number of the user to find.
   * @param {object} projection - The fields to project in the query.
   * @returns {Promise<object>} The user object if found, null otherwise.
   */
  findById: async function (idNumber, projection = null) {
    try {
      return await User.findOne({ idNumber }, projection);
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw new Error("Database query failed");
    }
  },

};

module.exports = UserRepository