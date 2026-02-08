const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
    minlength: [2, 'Name must be at least 2 characters'],
    validate: [
      {
        validator: function(v) {
          // Allow letters, spaces, hyphens, and apostrophes
          return /^[a-zA-Z\s\-']+$/.test(v);
        },
        message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
      },
      {
        validator: function(v) {
          // Reject whitespace-only strings
          return v && v.trim().length > 0;
        },
        message: 'Name cannot be empty or contain only whitespace'
      }
    ]
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      {
        validator: function(v) {
          // Reject whitespace-only strings
          return v && v.trim().length > 0;
        },
        message: 'Email cannot be empty or contain only whitespace'
      }
    ]
    // Removed index: true to avoid duplicate index warning
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
    minlength: [10, 'Message must be at least 10 characters'],
    validate: {
      validator: function(v) {
        // Reject whitespace-only strings
        return v && v.trim().length >= 10;
      },
      message: 'Message must contain at least 10 non-whitespace characters'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
    // Removed index: true to avoid duplicate index warning
  },
  read: {
    type: Boolean,
    default: false
    // Removed index: true to avoid duplicate index warning
  },
  ipAddress: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return validator.isIP(v);
      },
      message: 'Invalid IP address format'
    }
  }
}, {
  timestamps: true,
  collection: 'contacts'
});

// Indexes for performance optimization
// Single field indexes
ContactSchema.index({ createdAt: -1 }); // For sorting by date
ContactSchema.index({ email: 1 }); // For email lookups

// Compound indexes for common query patterns
ContactSchema.index({ read: 1, createdAt: -1 }); // For filtering unread and sorting
ContactSchema.index({ email: 1, createdAt: -1 }); // For email-based queries with date sorting

// Text index for search functionality (optional but useful for future features)
ContactSchema.index({ name: 'text', message: 'text' });

// Pre-save middleware for data sanitization
ContactSchema.pre('save', function(next) {
  // Additional sanitization
  if (this.name) {
    this.name = this.name.replace(/\s+/g, ' ').trim();
  }
  if (this.message) {
    this.message = this.message.trim();
  }
  next();
});

// Instance methods
ContactSchema.methods.markAsRead = function() {
  this.read = true;
  return this.save();
};

ContactSchema.methods.toJSON = function() {
  const contact = this.toObject();
  // Remove sensitive information when converting to JSON
  delete contact.__v;
  return contact;
};

// Static methods
ContactSchema.statics.findUnread = function() {
  return this.find({ read: false }).sort({ createdAt: -1 });
};

ContactSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Contact', ContactSchema);