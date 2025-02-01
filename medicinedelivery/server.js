const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// ---------- Middleware to Initialize Cart ----------
function initializeCart(req, res, next) {
  if (!req.session.cart) req.session.cart = [];
  next();
}

// ---------- Route: Display All Medicines ----------
router.get('/', (req, res) => {
  const query = 'SELECT * FROM medicines';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching medicines:', err);
      return res.status(500).send('An error occurred while fetching medicines.');
    }
    res.render('medicinedelivery/index', { products: results });
  });
});

// ---------- Route: Display Cart ----------
router.get('/cart', initializeCart, (req, res) => {
  res.render('medicinedelivery/cart', { cart: req.session.cart });
});

// ---------- Route: Add Items to Cart ----------
router.post('/cart', initializeCart, (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).send('Product ID is required.');
  }

  const query = 'SELECT * FROM medicines WHERE id = ?';
  db.query(query, [productId], (err, results) => {
    if (err) return res.status(500).send('Error adding product to cart.');
    if (results.length === 0) return res.status(404).send('Medicine not found.');

    const product = results[0];
    const cart = req.session.cart;

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }

    req.session.cart = cart;
    res.redirect('/medicinedelivery/cart');
  });
});

// ---------- Route: Remove Item from Cart ----------
router.post('/cart/remove', initializeCart, (req, res) => {
  const { productId } = req.body;

  if (!productId) return res.status(400).send('Product ID is required.');

  req.session.cart = req.session.cart.filter(
    (item) => item.id !== parseInt(productId)
  );
  res.redirect('/medicinedelivery/cart');
});

// ---------- Route: Place an Order ----------
router.post('/order', initializeCart, (req, res) => {
  const { delivery_address } = req.body;

  if (!delivery_address) return res.status(400).send('Delivery address is required.');
  if (req.session.cart.length === 0) return res.status(400).send('Your cart is empty.');

  const total_price = req.session.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderQuery =
    'INSERT INTO orders (total_price, delivery_address) VALUES (?, ?)';
  db.query(orderQuery, [total_price, delivery_address], (err, result) => {
    if (err) return res.status(500).send('Failed to place order.');

    const orderId = result.insertId;

    const itemsQuery =
      'INSERT INTO order_items (order_id, medicine_id, price, quantity) VALUES ?';
    const orderItems = req.session.cart.map((item) => [
      orderId,
      item.id,
      item.price,
      item.quantity,
    ]);

    db.query(itemsQuery, [orderItems], (err) => {
      if (err) return res.status(500).send('Failed to process order items.');

      req.session.cart = [];
      res.redirect(`/medicinedelivery/order/${orderId}`);
    });
  });
});

// ---------- Route: Display Order Details ----------
router.get('/order/:id', (req, res) => {
  const orderId = req.params.id;

  const orderQuery = 'SELECT * FROM orders WHERE id = ?';
  db.query(orderQuery, [orderId], (err, results) => {
    if (err || results.length === 0) return res.status(404).send('Order not found.');

    const order = results[0];

    const itemsQuery = 'SELECT * FROM order_items WHERE order_id = ?';
    db.query(itemsQuery, [orderId], (err, items) => {
      if (err) return res.status(500).send('Failed to fetch order details.');
      res.render('medicinedelivery/orderDetails', { order, items });
    });
  });
});

module.exports = router;
