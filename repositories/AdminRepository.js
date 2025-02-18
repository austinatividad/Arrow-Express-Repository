const Admin = require('../models/admindb.js');

const AdminRepository = {
  /**
   * Finds an admin by their ID number.
   * @param {string} idNumber - The ID number of the admin to find.
   * @returns {Promise<object>} The admin object if found, null otherwise.
   */
  findAdminById: async function(idNumber) {
    try {
      return await Admin.findOne(
        { idNumber: idNumber },
        'idNumber firstName lastName designation passengerType'
      );
    } catch (error) {
      console.error("Error finding admin by ID:", error);
      throw new Error("Database query failed");
    }
  },

  /**
   * Finds an admin by their email and security code.
   * @param {string} email - The email of the admin to find.
   * @param {string} securityCode - The security code of the admin to find.
   * @returns {Promise<object>} The admin object if found, null otherwise.
   */
  findAdminByEmailAndSecurityCode: async function (email, securityCode) {
    try {
      return await Admin.findOne({ email, securityCode });
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
  updateUserPassword: async function (idNumber, password) {
    try {
      return await Admin.updateOne({ idNumber }, { password });
    } catch (error) {
      console.error("Error updating admin password:", error);
      throw new Error("Database query failed");
    }
  }
};

module.exports = AdminRepository;