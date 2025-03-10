const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  referenceNumber: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['rfp-analysis', 'bid-evaluation', 'bid-comparison', 'compliance-check'],
    required: true
  },
  relatedRFP: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RFP'
  },
  relatedRFPReference: String,
  relatedBids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  }],
  relatedBidReferences: [String],
  generatedBy: {
    type: String,
    enum: ['compliance-agent', 'evaluation-agent', 'comparative-agent'],
    required: true
  },
  aiModel: {
    type: String,
    default: 'GPT-4'
  },
  status: {
    type: String,
    enum: ['draft', 'final', 'archived'],
    default: 'draft'
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  findings: [{
    category: String,
    compliance: {
      type: String,
      enum: ['compliant', 'partial', 'non-compliant']
    },
    description: String,
    recommendation: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    }
  }],
  recommendations: String,
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
  chatHistory: [{
    role: {
      type: String,
      enum: ['user', 'system']
    },
    content: String,
    agent: String,
    model: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
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
  isPublic: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    accessLevel: {
      type: String,
      enum: ['view', 'edit', 'comment'],
      default: 'view'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Generate reference number before saving if not provided
ReportSchema.pre('save', async function(next) {
  if (this.isNew && !this.referenceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    let prefix = 'REP';
    let refPart = '';

    // Add reference to related document in the reference number
    if (this.relatedRFP && this.relatedRFPReference) {
      const rfpRef = this.relatedRFPReference.split('-')[1]; // Extract the date part
      refPart = `-RFP${rfpRef}`;
    } else if (this.relatedBids && this.relatedBids.length > 0 && this.relatedBidReferences && this.relatedBidReferences.length > 0) {
      const bidRef = this.relatedBidReferences[0].split('-')[1]; // Extract the date part from first bid
      refPart = `-BID${bidRef}`;
    }

    // Get count of reports for today to generate sequential number
    const count = await mongoose.model('Report').countDocuments({
      createdAt: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });

    // Format: REP-[RFPXXX/BIDXXX]-YYYYMMDD-XXX (where XXX is sequential number)
    this.referenceNumber = `${prefix}${refPart}-${year}${month}${day}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Report', ReportSchema);
