import pool from '../config/db';

class Review {
  static async addReview(name, rating, comment, userId) {
    const query = 'INSERT INTO reviews (name, rating, comment, user_id) VALUES (?, ?, ?, ?)';

    try {
      const [result] = await pool.query(query, [name, rating, comment, userId]);
      console.log('Review added:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

}

class Product {
  static async addProduct(name, images, description, category, sizes, userId) {
    const query = `
      INSERT INTO products (name, images, description, category, sizes, user_id) 
      VALUES (?, ?, ?, ?, ?, ?)`;

    try {
      const [result] = await pool.query(query, [name, JSON.stringify(images), description, JSON.stringify(category), JSON.stringify(sizes), userId]);
      console.log('Product added:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  // Add more methods as needed
}

export { Review, Product };
