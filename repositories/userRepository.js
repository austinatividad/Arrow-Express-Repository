const User = require('../models/userdb.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
        'idNumber firstName lastName designation passengerType profilePicture'
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
   * Updates the profile of a user.
   * @param {string} idNumber - The ID number of the user to update.
   * @param {object} updateData - The data to update the user's profile with.
   * @returns {Promise<object>} The updated user object.
   */
  updateProfile: async function (idNumber, updateData) {
    try {
      return await User.updateOne(
        { idNumber },
        updateData
      );
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new Error("Profile update failed");
    }
  },

  /**
   * Updates the password of a user.
   * @param {string} idNumber - The ID number of the user to update.
   * @param {string} currentPassword - The current password of the user.
   * @param {string} newPassword - The new password for the user.
   * @returns {Promise<object>} The updated user object.
   */
  updatePassword: async function (idNumber, currentPassword, newPassword) {
    try {
      const user = await this.findByIdWithPassword(idNumber);
      if (!user) throw new Error("User not found");

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) throw new Error("Current password is incorrect");

      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      return await User.updateOne(
        { idNumber },
        { password: hashedPassword }
      );
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },

  /**
   * Updates the security code of a user.
   * @param {string} idNumber - The ID number of the user to update.
   * @param {string} currentCode - The current security code of the user.
   * @param {string} newCode - The new security code for the user.
   * @returns {Promise<object>} The updated user object.
   */
  updateSecurityCode: async function (idNumber, currentCode, newCode) {
    try {
      const user = await User.findOne({ idNumber }, 'securityCode');
      if (!user) throw new Error("User not found");

      const isValid = await bcrypt.compare(currentCode, user.securityCode);
      if (!isValid) throw new Error("Current security code is incorrect");

      const hashedCode = await bcrypt.hash(newCode, saltRounds);
      return await User.updateOne(
        { idNumber },
        { securityCode: hashedCode }
      );
    } catch (error) {
      console.error("Error updating security code:", error);
      throw error;
    }
  },

  /**
   * Deletes a user's account.
   * @param {string} idNumber - The ID number of the user to delete.
   * @param {string} password - The password of the user to delete.
   * @returns {Promise<boolean>} True if the account was deleted, false otherwise.
   */
  deleteAccount: async function (idNumber, password) {
    try {
      const isValid = await this.verifyPassword(idNumber, password);
      if (!isValid) throw new Error("Invalid password");

      await User.deleteOne({ idNumber });
      return true;
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
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
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return await User.updateOne(
        { idNumber },
        { password: hashedPassword }
      );
    } catch (error) {
      console.error("Error updating user password:", error);
      throw new Error("Database update failed");
    }
  },
};

module.exports = UserRepository;