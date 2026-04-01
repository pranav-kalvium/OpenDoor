const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if event is approved
    if (event.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Event is not open for registration' });
    }

    // Check deadline
    if (event.registration_deadline && new Date() > event.registration_deadline) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed' });
    }

    // Check capacity
    if (event.max_attendees) {
      const count = await Registration.countDocuments({ event_id: event._id, status: 'registered' });
      if (count >= event.max_attendees) {
        return res.status(400).json({ success: false, message: 'Event is full' });
      }
    }

    // Check duplicate
    const existing = await Registration.findOne({ event_id: event._id, user_id: req.userId });
    if (existing && existing.status === 'registered') {
      return res.status(409).json({ success: false, message: 'Already registered for this event' });
    }

    // If previously cancelled, re-register
    if (existing && existing.status === 'cancelled') {
      existing.status = 'registered';
      existing.registered_at = new Date();
      await existing.save();
      return res.json({ success: true, data: existing, message: 'Re-registered successfully' });
    }

    const registration = new Registration({
      event_id: event._id,
      user_id: req.userId
    });
    await registration.save();

    res.status(201).json({ success: true, data: registration, message: 'Registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Already registered for this event' });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Unregister from an event
exports.unregisterFromEvent = async (req, res) => {
  try {
    const registration = await Registration.findOneAndUpdate(
      { event_id: req.params.eventId, user_id: req.userId, status: 'registered' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    res.json({ success: true, message: 'Unregistered successfully' });
  } catch (error) {
    console.error('Unregister error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get current user's registrations
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user_id: req.userId,
      status: 'registered'
    }).populate('event_id').sort({ registered_at: -1 });

    res.json({
      success: true,
      data: registrations.filter(r => r.event_id != null) // filter out deleted events
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Check if user is registered for a specific event
exports.checkRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      event_id: req.params.eventId,
      user_id: req.userId,
      status: 'registered'
    });

    res.json({ success: true, isRegistered: !!registration });
  } catch (error) {
    console.error('Check registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get attendees for an event (manager/admin)
exports.getEventAttendees = async (req, res) => {
  try {
    const registrations = await Registration.find({
      event_id: req.params.eventId,
      status: 'registered'
    }).populate('user_id', 'username email profile.firstName profile.lastName');

    res.json({
      success: true,
      data: registrations,
      count: registrations.length
    });
  } catch (error) {
    console.error('Get attendees error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Export attendees as CSV
exports.exportAttendees = async (req, res) => {
  try {
    const registrations = await Registration.find({
      event_id: req.params.eventId,
      status: 'registered'
    }).populate('user_id', 'username email profile.firstName profile.lastName');

    const csv = [
      'Name,Email,Username,Registered At',
      ...registrations.map(r => {
        const u = r.user_id;
        const name = `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim() || u.username;
        return `"${name}","${u.email}","${u.username}","${r.registered_at.toISOString()}"`;
      })
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=attendees-${req.params.eventId}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Export attendees error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
