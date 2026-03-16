import pool from '../config/mysql.js';
import { SearchHistory } from '../config/mongo.js';

export const getUserPlan = async (userId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT p.search_limit 
       FROM users u 
       JOIN plans p ON u.plan_id = p.id 
       WHERE u.id = ?`, 
      [userId]
    );
    return rows[0]?.search_limit || 7; // Default free
  } finally {
    conn.release();
  }
};

export const getTodaySearchesCount = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await SearchHistory.countDocuments({
    userId,
    createdAt: { $gte: today, $lt: tomorrow }
  });
};

export const canSearch = async (userId) => {
  const limit = await getUserPlan(userId);
  const count = await getTodaySearchesCount(userId);
  return count < limit;
};

