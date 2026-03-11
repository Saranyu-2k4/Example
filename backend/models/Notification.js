const db = require('../config/database');

class Notification {
  static async create(notificationData) {
    const { user_id, type, title, message, related_id } = notificationData;
    const [result] = await db.execute(
      'INSERT INTO notifications (user_id, type, title, message, related_id) VALUES (?, ?, ?, ?, ?)',
      [user_id, type, title, message, related_id || null]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  static async markAsRead(notificationId) {
    await db.execute('UPDATE notifications SET is_read = TRUE WHERE id = ?', [notificationId]);
  }

  static async markAllAsRead(userId) {
    await db.execute('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
  }

  static async getUnreadCount(userId) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );
    return rows[0].count;
  }

  static async delete(notificationId) {
    await db.execute('DELETE FROM notifications WHERE id = ?', [notificationId]);
  }
}

module.exports = Notification;
