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
   * Finds an admin by their email.
   * @param {string} email - The email of the admin to find.
   * @returns {Promise<object>} The admin object if found, null otherwise.
   */
  findAdminByEmail: async function(email) {
    try {
      return await Admin.findOne(
        { email: email },
        'idNumber email'
      );
    } catch (error) {
      console.error("Error finding admin by email:", error);
      throw new Error("Database query failed");
    }
  }
};

module.exports = AdminRepository;