const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  referenceNumber: {
    type: String,
    required: true,
    unique: true
  },
  rfp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RFP',
    required: true
  },
  rfpReferenceNumber: {
    type: String,
    required: true
  },
  vendor: {
    name: {
      type: String,
      required: true
    },
    contactPerson: String,
    email: String,
    phone: String,
    address: String,
    website: String
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['received', 'under-review', 'shortlisted', 'rejected', 'accepted'],
    default: 'received'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  proposedStartDate: Date,
  proposedEndDate: Date,
  technicalScore: {
    type: Number,
    min: 0,
    max: 100
  },
  financialScore: {
    type: Number,
    min: 0,
    max: 100
  },
  totalScore: {
    type: Number,
    min: 0,
    max: 100
  },
  responseToRequirements: [{
    requirementId: String,
    response: String,
    complianceLevel: {
      type: String,
      enum: ['fully-compliant', 'partially-compliant', 'non-compliant', 'alternative-solution'],
      default: 'fully-compliant'
    },
    notes: String
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
  evaluationNotes: [{
    criterion: String,
    score: Number,
    notes: String,
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    evaluatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  strengths: [String],
  weaknesses: [String],
  risks: [{
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    mitigationPlan: String
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
  }]
}, { timestamps: true });

// Generate reference number before saving if not provided
BidSchema.pre('save', async function(next) {
  if (this.isNew && !this.referenceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Get RFP reference number
    const rfpRef = this.rfpReferenceNumber.split('-')[1]; // Extract the date part

    // Get count of bids for this RFP to generate sequential number
    const count = await mongoose.model('Bid').countDocuments({
      rfp: this.rfp
    });

    // Format: BID-RFPXXX-YYYYMMDD-XXX (where XXX is sequential number)
    this.referenceNumber = `BID-${rfpRef}-${year}${month}${day}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Calculate total score when saving
BidSchema.pre('save', function(next) {
  if (this.technicalScore !== undefined && this.financialScore !== undefined) {
    // Assuming a 70/30 split between technical and financial scores
    this.totalScore = (this.technicalScore * 0.7) + (this.financialScore * 0.3);
  }
  next();
});

module.exports = mongoose.model('Bid', BidSchema);
