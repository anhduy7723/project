import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root1234',
  database: 'mysql', 
});

(async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query('CREATE DATABASE IF NOT EXISTS mysql');
    connection.release();
    console.log('Database connected or created successfully.');

    // Switch to the newly created database
    await pool.query('USE mysql');
  } catch (error) {
    console.error('Error connecting to or creating database:', error);
  }
})();

export default pool;
