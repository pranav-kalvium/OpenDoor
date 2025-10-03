const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
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

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

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
router.post('/', authMiddleware, upload.single('image'), eventValidation, createEvent);
router.put('/:id', authMiddleware, upload.single('image'), eventValidation, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);
router.post('/:id/save', authMiddleware, saveEvent);
router.delete('/:id/save', authMiddleware, unsaveEvent);

module.exports = router;
