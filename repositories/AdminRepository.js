const Admin = require('../models/admindb.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const AdminRepository = {
  /**
   * Finds an admin by their ID number.
   * @param {string} idNumber - The ID number of the admin to find.
   * @returns {Promise<object>} The admin object if found, null otherwise.
   */
  findById: async function(idNumber) {
    try {
      return await Admin.findOne(
        { idNumber: idNumber },
        'idNumber firstName lastName designation passengerType profilePicture'
      );
    } catch (error) {
      console.error("Error finding admin by ID:", error);
      throw new Error("Database query failed");
    }
  },

  /**
   * Finds an admin by their ID number, including their password.
   * @param {string} idNumber - The ID number of the admin to find.
   * @returns {Promise<object>} The admin object if found, null otherwise.
   */
  findByIdWithPassword: async function(idNumber) {
    try {
      return await Admin.findOne(
        { idNumber: idNumber },
        'idNumber password'
      );
    } catch (error) {
      console.error("Error finding admin by ID:", error);
      throw new Error("Database query failed");
    }
  },

  /**
   * Verifies the password of an admin.
   * @param {string} idNumber - The ID number of the admin to verify.
   * @param {string} password - The password to verify.
   * @returns {Promise<object>} The admin object if the password is valid, null otherwise.
   */
  verifyPassword: async function(idNumber, password) {
    try {
      const admin = await this.findByIdWithPassword(idNumber);
      if (!admin) return null;
      
      const isValid = await bcrypt.compare(password, admin.password);
      return isValid ? admin : null;
    } catch (error) {
      console.error("Error verifying password:", error);
      throw new Error("Password verification failed");
    }
  },

  /**
   * Updates the profile of an admin.
   * @param {string} idNumber - The ID number of the admin to update.
   * @param {object} updateData - The data to update in the admin's profile.
   * @returns {Promise<object>} The updated admin object.
   */
  updateProfile: async function(idNumber, updateData) {
    try {
      return await Admin.updateOne(
        { idNumber },
        updateData
      );
    } catch (error) {
      console.error("Error updating admin profile:", error);
      throw new Error("Profile update failed");
    }
  },

  /**
   * Updates the password of an admin.
   * @param {string} idNumber - The ID number of the admin to update.
   * @param {string} currentPassword - The current password of the admin.
   * @param {string} newPassword - The new password for the admin.
   * @returns {Promise<object>} The updated admin object.
   */
  updatePassword: async function(idNumber, currentPassword, newPassword) {
    try {
      const admin = await this.findByIdWithPassword(idNumber);
      if (!admin) throw new Error("Admin not found");

      const isValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isValid) throw new Error("Current password is incorrect");

      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      return await Admin.updateOne(
        { idNumber },
        { password: hashedPassword }
      );
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },

  /**
   * Updates the security code of an admin.
   * @param {string} idNumber - The ID number of the admin to update.
   * @param {string} currentCode - The current security code of the admin.
   * @param {string} newCode - The new security code for the admin.
   * @returns {Promise<object>} The updated admin object.
   */
  updateSecurityCode: async function(idNumber, currentCode, newCode) {
    try {
      const admin = await Admin.findOne({ idNumber }, 'securityCode');
      if (!admin) throw new Error("Admin not found");

      const isValid = await bcrypt.compare(currentCode, admin.securityCode);
      if (!isValid) throw new Error("Current security code is incorrect");

      const hashedCode = await bcrypt.hash(newCode, saltRounds);
      return await Admin.updateOne(
        { idNumber },
        { securityCode: hashedCode }
      );
    } catch (error) {
      console.error("Error updating security code:", error);
      throw error;
    }
  },

  /**
   * Deletes an admin's account.
   * @param {string} idNumber - The ID number of the admin to delete.
   * @param {string} password - The password of the admin to delete.
   * @returns {Promise<boolean>} True if the account was deleted, false otherwise.
   */
  deleteAccount: async function(idNumber, password) {
    try {
      const isValid = await this.verifyPassword(idNumber, password);
      if (!isValid) throw new Error("Invalid password");

      await Admin.deleteOne({ idNumber });
      return true;
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  },

  /**
   * Finds an admin by their email and security code.
   * @param {string} email - The email of the admin to find.
   * @param {string} securityCode - The security code of the admin to find.
   * @returns {Promise<object>} The admin object if found, null otherwise.
   */
  findByEmailAndSecurityCode: async function(email, securityCode) {
    try {
      return await Admin.findOne(
        { email, securityCode },
        'idNumber email securityCode'
      );
    } catch (error) {
      console.error("Error finding admin by email and security code:", error);
      throw new Error("Database query failed");
    }
  },

  /**
   * Updates the password of an admin.
   * @param {string} idNumber - The ID number of the admin to update.
   * @param {string} password - The new password for the admin.
   * @returns {Promise<object>} The updated admin object.
   */
  updateAdminPassword: async function(idNumber, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return await Admin.updateOne(
        { idNumber },
        { password: hashedPassword }
      );
    } catch (error) {
      console.error("Error updating admin password:", error);
      throw new Error("Database update failed");
    }
  }
};

module.exports = AdminRepository;