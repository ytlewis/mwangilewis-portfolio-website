const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
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
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    validate: [
      {
        validator: function(v) {
          // Password must contain at least one uppercase, one lowercase, one number, and one special character
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(v);
        },
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      },
      {
        validator: function(v) {
          // Reject whitespace-only strings
          return v && v.trim().length >= 8;
        },
        message: 'Password cannot be empty or contain only whitespace'
      }
    ]
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin',
    required: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
    // Removed index: true to avoid duplicate index warning
  },
  isActive: {
    type: Boolean,
    default: true
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'admins'
});

// Indexes for performance and security
// Note: email already has unique index from unique: true in schema
AdminSchema.index({ lastLogin: -1 }); // For sorting by last login
AdminSchema.index({ isActive: 1, lastLogin: -1 }); // Compound index for active users
AdminSchema.index({ lockUntil: 1 }); // For checking locked accounts

// Virtual for account lock status
AdminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware for password hashing
AdminSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

AdminSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  this.loginAttempts = 0;
  this.lockUntil = null;
  return this.save();
};

AdminSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we have exceeded max attempts and it's not locked already, lock the account
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

AdminSchema.methods.toJSON = function() {
  const admin = this.toObject();
  // Remove sensitive information when converting to JSON
  delete admin.password;
  delete admin.__v;
  delete admin.loginAttempts;
  delete admin.lockUntil;
  return admin;
};

// Static methods
AdminSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

AdminSchema.statics.createAdmin = async function(email, password) {
  const admin = new this({
    email: email.toLowerCase(),
    password: password
  });
  return await admin.save();
};

// Pre-remove middleware to prevent deletion of the last admin
AdminSchema.pre('remove', async function(next) {
  const adminCount = await this.constructor.countDocuments();
  if (adminCount <= 1) {
    const error = new Error('Cannot delete the last admin user');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

module.exports = mongoose.model('Admin', AdminSchema);