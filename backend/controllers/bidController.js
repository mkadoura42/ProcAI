const { validationResult } = require('express-validator');
const Bid = require('../models/Bid');
const RFP = require('../models/RFP');
const fs = require('fs');
const path = require('path');

/**
 * Get all bids
 * @route GET /api/bids
 * @access Private
 */
exports.getAllBids = async (req, res) => {
  try {
    // Parse query parameters for filtering
    const { rfp, status, vendor, search, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};

    if (rfp) filter.rfp = rfp;
    if (status) filter.status = status;
    if (vendor) filter['vendor.name'] = { $regex: vendor, $options: 'i' };

    // Search in vendor name, reference number, or rfp reference number
    if (search) {
      filter.$or = [
        { 'vendor.name': { $regex: search, $options: 'i' } },
        { referenceNumber: { $regex: search, $options: 'i' } },
        { rfpReferenceNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.submissionDate = -1; // Default sort by submission date (newest first)
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get bids with pagination
    const bids = await Bid.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('rfp', 'title referenceNumber submissionDeadline')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('evaluationNotes.evaluatedBy', 'name email');

    // Get total count for pagination
    const total = await Bid.countDocuments(filter);

    res.json({
      bids,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all bids error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get bid by ID
 * @route GET /api/bids/:id
 * @access Private
 */
exports.getBidById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate('rfp', 'title referenceNumber submissionDeadline requirements complianceRequirements evaluationCriteria')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('evaluationNotes.evaluatedBy', 'name email')
      .populate('notes.createdBy', 'name email');

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    res.json(bid);
  } catch (error) {
    console.error('Get bid by ID error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Bid not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new bid
 * @route POST /api/bids
 * @access Private/Manager+Admin
 */
exports.createBid = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    rfp,
    vendor,
    submissionDate,
    status,
    totalAmount,
    currency,
    proposedStartDate,
    proposedEndDate,
    responseToRequirements,
    referenceNumber
  } = req.body;

  try {
    // Check if RFP exists
    const rfpDoc = await RFP.findById(rfp);
    if (!rfpDoc) {
      return res.status(404).json({ message: 'RFP not found' });
    }

    // Create new bid
    const bid = new Bid({
      rfp,
      rfpReferenceNumber: rfpDoc.referenceNumber,
      vendor,
      submissionDate: submissionDate || Date.now(),
      status: status || 'received',
      totalAmount,
      currency: currency || 'USD',
      proposedStartDate,
      proposedEndDate,
      responseToRequirements: responseToRequirements || [],
      createdBy: req.user.id,
      referenceNumber
    });

    // Save bid to database
    await bid.save();

    res.status(201).json({
      message: 'Bid created successfully',
      bid
    });
  } catch (error) {
    console.error('Create bid error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update bid
 * @route PUT /api/bids/:id
 * @access Private/Manager+Admin
 */
exports.updateBid = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    vendor,
    submissionDate,
    status,
    totalAmount,
    currency,
    proposedStartDate,
    proposedEndDate,
    responseToRequirements,
    technicalScore,
    financialScore,
    strengths,
    weaknesses,
    risks
  } = req.body;

  try {
    // Find bid
    let bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Build bid object
    const bidFields = {};
    if (vendor) bidFields.vendor = vendor;
    if (submissionDate) bidFields.submissionDate = submissionDate;
    if (status) bidFields.status = status;
    if (totalAmount) bidFields.totalAmount = totalAmount;
    if (currency) bidFields.currency = currency;
    if (proposedStartDate) bidFields.proposedStartDate = proposedStartDate;
    if (proposedEndDate) bidFields.proposedEndDate = proposedEndDate;
    if (responseToRequirements) bidFields.responseToRequirements = responseToRequirements;
    if (technicalScore !== undefined) bidFields.technicalScore = technicalScore;
    if (financialScore !== undefined) bidFields.financialScore = financialScore;
    if (strengths) bidFields.strengths = strengths;
    if (weaknesses) bidFields.weaknesses = weaknesses;
    if (risks) bidFields.risks = risks;

    // Add updatedBy field
    bidFields.updatedBy = req.user.id;

    // Update bid
    bid = await Bid.findByIdAndUpdate(
      req.params.id,
      { $set: bidFields },
      { new: true }
    ).populate('rfp', 'title referenceNumber')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      message: 'Bid updated successfully',
      bid
    });
  } catch (error) {
    console.error('Update bid error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Bid not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete bid
 * @route DELETE /api/bids/:id
 * @access Private/Admin
 */
exports.deleteBid = async (req, res) => {
  try {
    // Find bid
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Delete attachments
    if (bid.attachments && bid.attachments.length > 0) {
      bid.attachments.forEach(attachment => {
        const filePath = path.join(__dirname, '..', 'uploads', path.basename(attachment.path));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Delete bid
    await Bid.findByIdAndDelete(req.params.id);

    res.json({ message: 'Bid deleted successfully' });
  } catch (error) {
    console.error('Delete bid error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Bid not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add attachment to bid
 * @route POST /api/bids/:id/attachments
 * @access Private/Manager+Admin
 */
exports.addAttachment = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Find bid
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      // Delete uploaded file if bid not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Create attachment object
    const attachment = {
      name: req.file.originalname,
      path: req.file.path,
      fileType: req.file.mimetype,
      size: req.file.size
    };

    // Add attachment to bid
    bid.attachments.push(attachment);
    bid.updatedBy = req.user.id;

    await bid.save();

    res.json({
      message: 'Attachment added successfully',
      attachment
    });
  } catch (error) {
    console.error('Add attachment error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Bid not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete attachment from bid
 * @route DELETE /api/bids/:id/attachments/:attachmentId
 * @access Private/Manager+Admin
 */
exports.deleteAttachment = async (req, res) => {
  try {
    // Find bid
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Find attachment
    const attachment = bid.attachments.id(req.params.attachmentId);

    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', 'uploads', path.basename(attachment.path));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove attachment from bid
    bid.attachments.pull(req.params.attachmentId);
    bid.updatedBy = req.user.id;

    await bid.save();

    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Delete attachment error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Bid or attachment not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add evaluation note to bid
 * @route POST /api/bids/:id/evaluation
 * @access Private/Manager+Admin
 */
exports.addEvaluationNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { criterion, score, notes } = req.body;

  try {
    // Find bid
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Create evaluation note object
    const evaluationNote = {
      criterion,
      score,
      notes,
      evaluatedBy: req.user.id
    };

    // Add evaluation note to bid
    bid.evaluationNotes.push(evaluationNote);
    bid.updatedBy = req.user.id;

    await bid.save();

    // Populate user info for the new evaluation note
    await bid.populate('evaluationNotes.evaluatedBy', 'name email');

    res.json({
      message: 'Evaluation note added successfully',
      evaluationNote: bid.evaluationNotes[bid.evaluationNotes.length - 1]
    });
  } catch (error) {
    console.error('Add evaluation note error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Bid not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add note to bid
 * @route POST /api/bids/:id/notes
 * @access Private
 */
exports.addNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content } = req.body;

  try {
    // Find bid
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Create note object
    const note = {
      content,
      createdBy: req.user.id
    };

    // Add note to bid
    bid.notes.push(note);
    bid.updatedBy = req.user.id;

    await bid.save();

    // Populate user info for the new note
    await bid.populate('notes.createdBy', 'name email');

    res.json({
      message: 'Note added successfully',
      note: bid.notes[bid.notes.length - 1]
    });
  } catch (error) {
    console.error('Add note error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Bid not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get bids by RFP ID
 * @route GET /api/bids/rfp/:rfpId
 * @access Private
 */
exports.getBidsByRFP = async (req, res) => {
  try {
    const bids = await Bid.find({ rfp: req.params.rfpId })
      .sort({ submissionDate: -1 })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json(bids);
  } catch (error) {
    console.error('Get bids by RFP error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'RFP not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get bid statistics
 * @route GET /api/bids/stats
 * @access Private
 */
exports.getBidStats = async (req, res) => {
  try {
    // Get total bids count
    const totalBids = await Bid.countDocuments();

    // Get bids by status
    const receivedCount = await Bid.countDocuments({ status: 'received' });
    const underReviewCount = await Bid.countDocuments({ status: 'under-review' });
    const shortlistedCount = await Bid.countDocuments({ status: 'shortlisted' });
    const rejectedCount = await Bid.countDocuments({ status: 'rejected' });
    const acceptedCount = await Bid.countDocuments({ status: 'accepted' });

    // Get average bid amount
    const avgResult = await Bid.aggregate([
      { $group: { _id: null, avgAmount: { $avg: '$totalAmount' } } }
    ]);
    const averageBidAmount = avgResult.length > 0 ? avgResult[0].avgAmount : 0;

    // Get top vendors by number of bids
    const topVendors = await Bid.aggregate([
      { $group: { _id: '$vendor.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get recent bids (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentBids = await Bid.countDocuments({
      submissionDate: { $gte: thirtyDaysAgo }
    });

    res.json({
      totalBids,
      byStatus: {
        received: receivedCount,
        underReview: underReviewCount,
        shortlisted: shortlistedCount,
        rejected: rejectedCount,
        accepted: acceptedCount
      },
      averageBidAmount,
      topVendors,
      recentBids
    });
  } catch (error) {
    console.error('Get bid stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
