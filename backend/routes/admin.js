const express = require('express');
const Contact = require('../models/Contact');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/contacts - Get all contact submissions
router.get('/contacts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Use lean() for better performance on read-only queries
    // lean() returns plain JavaScript objects instead of Mongoose documents
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .select('-__v'); // Exclude version key

    // Use countDocuments with hint to use index
    const total = await Contact.countDocuments().hint({ createdAt: -1 });

    res.json({
      success: true,
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contacts'
    });
  }
});

// GET /api/admin/contacts/:id - Get specific contact
router.get('/contacts/:id', async (req, res) => {
  try {
    // Use lean() for read-only query
    const contact = await Contact.findById(req.params.id)
      .lean()
      .select('-__v');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      contact
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contact'
    });
  }
});

// PUT /api/admin/contacts/:id - Update contact (mark as read, etc.)
router.put('/contacts/:id', async (req, res) => {
  try {
    const { read } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: read !== undefined ? read : true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      contact
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact'
    });
  }
});

// DELETE /api/admin/contacts/:id - Delete contact
router.delete('/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
});

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Optimize dashboard queries by running them in parallel
    // Use lean() for read-only queries and hint to use indexes
    const [totalContacts, unreadContacts, recentContacts] = await Promise.all([
      Contact.countDocuments().hint({ createdAt: -1 }),
      Contact.countDocuments({ read: false }).hint({ read: 1, createdAt: -1 }),
      Contact.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .select('name email createdAt read -_id') // Only select needed fields
    ]);

    res.json({
      success: true,
      stats: {
        totalContacts,
        unreadContacts,
        recentContacts
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data'
    });
  }
});

module.exports = router;