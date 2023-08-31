import pool from '../config/db';
import bcrypt from 'bcryptjs';

class User {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    try {
      const [rows] = await pool.query(query);
      console.log('Users table created or already exists.');
    } catch (error) {
      console.error('Error creating users table:', error);
    }
  }

  static async addUser(user) {
    const { name, email, password, isAdmin } = user;

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)';
    
    try {
      const [result] = await pool.query(query, [name, email, hashedPassword, isAdmin]);
      console.log('User added:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  static async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';

    try {
      const [rows] = await pool.query(query, [email]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }
}

export default User;
