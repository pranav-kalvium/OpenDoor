const express = require('express');
const {
  registerForEvent,
  unregisterFromEvent,
  getMyRegistrations,
  checkRegistration,
  getEventAttendees,
  exportAttendees
} = require('../controllers/registrationController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Student routes
router.post('/:eventId', authMiddleware, registerForEvent);
router.delete('/:eventId', authMiddleware, unregisterFromEvent);
router.get('/my', authMiddleware, getMyRegistrations);
router.get('/check/:eventId', authMiddleware, checkRegistration);

// Manager/Admin routes
router.get('/event/:eventId', authMiddleware, requireRole('manager', 'admin'), getEventAttendees);
router.get('/event/:eventId/export', authMiddleware, requireRole('manager', 'admin'), exportAttendees);

module.exports = router;
