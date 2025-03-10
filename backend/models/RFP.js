const mongoose = require('mongoose');

const RFPSchema = new mongoose.Schema({
  referenceNumber: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  client: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'active', 'closed', 'awarded', 'cancelled'],
    default: 'draft'
  },
  category: {
    type: String,
    required: true
  },
  budget: {
    type: Number
  },
  currency: {
    type: String,
    default: 'USD'
  },
  submissionDeadline: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  requirements: [{
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }
  }],
  attachments: [{
    name: String,
    path: String,
    uploadDate: {
      type: Date,
      default: Date.now
    },
    fileType: String,
    size: Number
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  complianceRequirements: [{
    title: String,
    description: String,
    isRequired: {
      type: Boolean,
      default: true
    }
  }],
  evaluationCriteria: [{
    name: String,
    description: String,
    weight: Number
  }]
}, { timestamps: true });

// Generate reference number before saving if not provided
RFPSchema.pre('save', async function(next) {
  if (this.isNew && !this.referenceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Get count of RFPs for today to generate sequential number
    const count = await mongoose.model('RFP').countDocuments({
      createdAt: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });

    // Format: RFP-YYYYMMDD-XXX (where XXX is sequential number)
    this.referenceNumber = `RFP-${year}${month}${day}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('RFP', RFPSchema);
