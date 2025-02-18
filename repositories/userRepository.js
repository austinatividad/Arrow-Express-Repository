const User = require('../models/userdb.js');
const bcrypt = require('bcrypt');

const UserRepository = {

  /**
   * Finds a user by their ID number.
   * @param {string} idNumber - The ID number of the user to find.
   * @returns {Promise<object>} The user object if found, null otherwise.
   */
  findById: async function (idNumber) {
    try {
      return await User.findOne(
        { idNumber: idNumber },
        'idNumber firstName lastName designation passengerType'
      );
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw new Error("Database query failed");
    }
  },

  /**
   * Finds a user by their ID number, including their password.
   * @param {string} idNumber - The ID number of the user to find.
   * @returns {Promise<object>} The user object if found, null otherwise.
   */
  findByIdWithPassword: async function (idNumber) {
    try {
      return await User.findOne(
        { idNumber: idNumber },
        'idNumber password'
      );
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw new Error("Database query failed");
    }
  },

  /**
   * Verifies a user's password.
   * @param {string} idNumber - The ID number of the user to verify.
   * @param {string} password - The password to verify.
   * @returns {Promise<object>} The user object if the password is valid, null otherwise.
   */
  verifyPassword: async function (idNumber, password) {
    try {
      const user = await this.findByIdWithPassword(idNumber);
      if (!user) return null;

      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? user : null;
    } catch (error) {
      console.error("Error verifying password:", error);
      throw new Error("Password verification failed");
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
      return await User.findOne(
        { email, securityCode },
        'idNumber email securityCode'
      );
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
      return await User.updateOne(
        { idNumber },
        { password }
      );
    } catch (error) {
      console.error("Error updating user password:", error);
      throw new Error("Database update failed");
    }
  },
};

module.exports = UserRepository;