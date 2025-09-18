const express = require('express');
const { body } = require('express-validator');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  saveEvent,
  unsaveEvent,
  searchEvents
} = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules for events
const eventValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid date'),
  body('location')
    .notEmpty()
    .withMessage('Location is required'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
];

// Routes
router.get('/', getEvents);
router.get('/search', searchEvents);
router.get('/:id', getEventById);
router.post('/', authMiddleware, eventValidation, createEvent);
router.put('/:id', authMiddleware, eventValidation, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);
router.post('/:id/save', authMiddleware, saveEvent);
router.delete('/:id/save', authMiddleware, unsaveEvent);

module.exports = router;