const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { register, login, getProfile, updateProfile, forgotPassword, resetPassword, verifyEmail, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Multer setup for avatar upload
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

// Validation rules
const registerValidation = [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value) => {
      // Allow any email in development for testing
      if (process.env.NODE_ENV !== 'production') return true;
      const allowedDomains = ['alliance.edu.in', 'allianceuniversity.edu.in'];
      const domain = value.split('@')[1];
      if (!allowedDomains.includes(domain)) {
        throw new Error('Please use your Alliance University email (@alliance.edu.in)');
      }
      return true;
    })
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, upload.single('avatar'), updateProfile);
router.put('/change-password', authMiddleware, changePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify/:token', verifyEmail);

module.exports = router;