const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderStatus,
  getOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(addOrderItems).get(protect, admin, getOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
