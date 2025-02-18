
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


  /**
   * Finds a user by their email and security code.
   * @param {string} email - The email of the user to find.
   * @param {string} securityCode - The security code of the user to find.
   * @returns {Promise<object>} The user object if found, null otherwise.
   */
  findByEmailAndSecurityCode: async function (email, securityCode) {
    try {
      return await User.findOne({ email, securityCode });
    } catch (error) {
      console.error("Error finding user by email and security code:", error);
      throw new Error("Database query failed");
    }
  },

  /**
   * Updates the password of a user.
   * @param {string} idNumber - The ID number of the user to update.
   * @param {string} password - The new password for the user.
   * @returns {Promise<object>} The updated user object.
   */
  updateUserPassword: async function (idNumber, password) {
    try {
      return await User.updateOne({ idNumber }, { password });
    } catch (error) {
      console.error("Error updating user password:", error);
      throw new Error("Database query failed");
    }
  },
};

module.exports = UserRepository;