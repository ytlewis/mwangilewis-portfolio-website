const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const emailService = require('../services/emailService');

const router = express.Router();

// Contact form validation rules
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

// POST /api/contact
router.post('/', contactValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, message } = req.body;

    // Create new contact entry
    const contact = new Contact({
      name,
      email,
      message,
      ipAddress: req.ip || req.connection.remoteAddress
    });

    await contact.save();

    // Send email notification (non-blocking)
    emailService.sendContactNotification({ name, email, message })
      .then(success => {
        if (success) {
          console.log('Contact notification email sent successfully');
        } else {
          console.warn('Failed to send contact notification email');
        }
      })
      .catch(error => {
        console.error('Error sending contact notification email:', error);
      });

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      id: contact._id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
});

module.exports = router;