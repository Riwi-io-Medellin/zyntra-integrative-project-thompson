import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

console.log("HOST:", process.env.MYSQL_HOST);
console.log("USER:", process.env.MYSQL_USER);
console.log("PASSWORD: [HIDDEN]");
console.log("DB:", process.env.MYSQL_DB);

// Table creation functions
const createTables = async () => {
  const conn = await pool.getConnection();
  try {
    // Users table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Plans table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        price DECIMAL(10,2),
        search_limit INT DEFAULT 7
      )
    `);

    // Insert example plans
    await conn.execute(`
      INSERT IGNORE INTO plans (name, price, search_limit) VALUES 
      ('Free', 0.00, 7),
      ('Premium', 9.99, 999999)
    `);

    // Subscriptions table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        plan_id INT,
        start_date DATE,
        end_date DATE,
        status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (plan_id) REFERENCES plans(id)
      )
    `);

    // Search tables for AI service integration
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS busquedas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        query VARCHAR(255),
        search_term VARCHAR(255),
        intent VARCHAR(500),
        total INT,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        busqueda_id INT,
        store VARCHAR(100),
        name VARCHAR(500),
        price DECIMAL(10,2),
        original_price DECIMAL(10,2),
        currency VARCHAR(10) DEFAULT 'COP',
        url TEXT,
        image_url TEXT,
        brand VARCHAR(200),
        category VARCHAR(200),
        in_stock BOOLEAN DEFAULT TRUE,
        rating DECIMAL(3,2),
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_busqueda (busqueda_id),
        INDEX idx_store (store)
      )
    `);

    console.log('MySQL Tables created successfully');
    conn.release();
  } catch (error) {
    conn.release();
    throw error;
  }
};

export { createTables };
export default pool;

