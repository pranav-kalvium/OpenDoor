const Event = require('../models/Event');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.getEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      saved,
      createdBy
    } = req.query;

    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by saved events for authenticated user
    if (saved === 'true' && req.userId) {
      const user = await User.findById(req.userId);
      query._id = { $in: user.savedEvents };
    }

    // Filter by creator
    if (createdBy) {
      query.createdBy = new mongoose.Types.ObjectId(createdBy);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { date: 1 },
      populate: 'createdBy',
    };

    // Using regular find instead of paginate for simplicity
    const events = await Event.find(query)
      .populate('createdBy')
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);

    const totalEvents = await Event.countDocuments(query);
    const totalPages = Math.ceil(totalEvents / options.limit);

    // Add isSaved flag for authenticated users
    if (req.userId) {
      const user = await User.findById(req.userId);
      events.forEach(event => {
        event.isSaved = user.savedEvents.includes(event._id);
      });
    }

    res.json({
      success: true,
      data: {
        events: events,
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalEvents: totalEvents,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Add isSaved flag for authenticated users
    if (req.userId) {
      const user = await User.findById(req.userId);
      event.isSaved = user.savedEvents.includes(event._id);
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// In your createEvent and updateEvent functions, ensure location is properly handled
exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Ensure location is properly formatted
    let locationData = req.body.location;
    
    // If location is a string, convert it to object format for consistency
    if (typeof locationData === 'string') {
      locationData = {
        address: locationData,
        coordinates: [77.5946, 12.9716] // Default Bangalore coordinates
      };
    }

    const eventData = {
      ...req.body,
      location: locationData,
      createdBy: req.userId
    };

    const event = new Event(eventData);
    await event.save();

    // Populate createdBy field
    await event.populate('createdBy');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the creator
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the creator
    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Remove event from all users' saved events
    await User.updateMany(
      { savedEvents: req.params.id },
      { $pull: { savedEvents: req.params.id } }
    );

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.saveEvent = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const eventId = req.params.id;

    if (user.savedEvents.includes(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Event already saved'
      });
    }

    user.savedEvents.push(eventId);
    await user.save();

    res.json({
      success: true,
      message: 'Event saved successfully'
    });
  } catch (error) {
    console.error('Save event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.unsaveEvent = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const eventId = req.params.id;

    if (!user.savedEvents.includes(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Event not saved'
      });
    }

    user.savedEvents = user.savedEvents.filter(id => id.toString() !== eventId);
    await user.save();

    res.json({
      success: true,
      message: 'Event removed from saved events'
    });
  } catch (error) {
    console.error('Unsave event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.searchEvents = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const events = await Event.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    }).populate('createdBy');

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Search events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};