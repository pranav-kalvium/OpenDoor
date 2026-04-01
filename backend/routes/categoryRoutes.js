const express = require('express');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public route to get categories
router.get('/', getCategories);

// Admin/Manager routes for category CRUD
router.post('/', authMiddleware, requireRole('admin', 'manager'), createCategory);
router.put('/:id', authMiddleware, requireRole('admin', 'manager'), updateCategory);
router.delete('/:id', authMiddleware, requireRole('admin', 'manager'), deleteCategory);

module.exports = router;
