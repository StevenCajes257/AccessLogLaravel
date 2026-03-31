import axios from 'axios';

// Change this if your Laravel API runs on a different port/domain
const API_BASE = 'http://localhost:8000/api';

/**
 * Verify admin login credentials
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, user?: object, message?: string}>}
 */
export const verifyAdmin = async (username, password) => {
  try {
    const res = await axios.post(`${API_BASE}/verify-admin`, { username, password });
    return res.data;
  } catch (err) {
    console.error("verifyAdmin error:", err.response?.data || err.message);
    return { success: false, message: 'Server error. Try again later.' };
  }
};

/**
 * Verify RFID card for admin access
 * @param {string} uid 
 * @returns {Promise<{isAdmin: boolean, message?: string}>}
 */
export const verifyAdminCard = async (uid) => {
  try {
    const res = await axios.get(`${API_BASE}/admin/verify-rfid/${uid}`);
    return res.data;
  } catch (err) {
    console.error("verifyAdminCard error:", err.response?.data || err.message);
    return { isAdmin: false, message: 'Server error. Try again later.' };
  }
};

/**
 * Fetch dashboard statistics
 * @returns {Promise<{signedIn: number, signedOut: number}>}
 */
export const getDashboardStats = async () => {
  try {
    const res = await axios.get(`${API_BASE}/dashboard-stats`);
    return res.data;
  } catch (err) {
    console.error("getDashboardStats error:", err.response?.data || err.message);
    throw new Error('Server error');
  }
};

/**
 * Fetch attendance logs by date
 * @param {string} date - format: YYYY-MM-DD
 * @returns {Promise<array>}
 */
export const getAttendanceByDate = async (date) => {
  try {
    const res = await axios.get(`${API_BASE}/attendance/${date}`);
    return res.data;
  } catch (err) {
    console.error("getAttendanceByDate error:", err.response?.data || err.message);
    throw new Error('Server error');
  }
};