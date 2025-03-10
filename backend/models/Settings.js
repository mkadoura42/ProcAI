const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['general', 'api', 'ai-agents', 'reference-codes', 'integrations', 'notifications', 'security'],
    required: true
  },
  key: {
    type: String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String
  },
  isEncrypted: {
    type: Boolean,
    default: false
  },
  isSystem: {
    type: Boolean,
    default: false
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Compound index to ensure uniqueness of category + key combination
SettingsSchema.index({ category: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Settings', SettingsSchema);
