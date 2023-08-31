import pool from '../config/db';

class Order {
  static async addOrder(user_id, orderItems, shippingAddress, paymentMethod, paymentResult, taxPrice, shippingPrice, totalPrice, isPaid, paidAt, isDelivered, deliveredAt) {
    const query = `
      INSERT INTO orders 
      (user_id, order_items, shipping_address, payment_method, payment_result, tax_price, shipping_price, total_price, is_paid, paid_at, is_delivered, delivered_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
      const [result] = await pool.query(query, [user_id, JSON.stringify(orderItems), JSON.stringify(shippingAddress), paymentMethod, JSON.stringify(paymentResult), taxPrice, shippingPrice, totalPrice, isPaid, paidAt, isDelivered, deliveredAt]);
      console.log('Order added:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  }

}

export default Order;
