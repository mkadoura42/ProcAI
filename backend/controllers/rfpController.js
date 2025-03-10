const { validationResult } = require('express-validator');
const RFP = require('../models/RFP');
const Bid = require('../models/Bid');
const fs = require('fs');
const path = require('path');

/**
 * Get all RFPs
 * @route GET /api/rfps
 * @access Private
 */
exports.getAllRFPs = async (req, res) => {
  try {
    // Parse query parameters for filtering
    const { status, category, client, search, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (client) filter.client = { $regex: client, $options: 'i' };

    // Search in title, description, or reference number
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { referenceNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by creation date (newest first)
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get RFPs with pagination
    const rfps = await RFP.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    // Get total count for pagination
    const total = await RFP.countDocuments(filter);

    res.json({
      rfps,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all RFPs error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get RFP by ID
 * @route GET /api/rfps/:id
 * @access Private
 */
exports.getRFPById = async (req, res) => {
  try {
    const rfp = await RFP.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!rfp) {
      return res.status(404).json({ message: 'RFP not found' });
    }

    res.json(rfp);
  } catch (error) {
    console.error('Get RFP by ID error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'RFP not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new RFP
 * @route POST /api/rfps
 * @access Private/Manager+Admin
 */
exports.createRFP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    description,
    client,
    status,
    category,
    budget,
    currency,
    submissionDeadline,
    startDate,
    endDate,
    requirements,
    complianceRequirements,
    evaluationCriteria,
    tags,
    referenceNumber
  } = req.body;

  try {
    // Create new RFP
    const rfp = new RFP({
      title,
      description,
      client,
      status: status || 'draft',
      category,
      budget,
      currency: currency || 'USD',
      submissionDeadline,
      startDate,
      endDate,
      requirements: requirements || [],
      complianceRequirements: complianceRequirements || [],
      evaluationCriteria: evaluationCriteria || [],
      tags: tags || [],
      createdBy: req.user.id,
      referenceNumber
    });

    // Save RFP to database
    await rfp.save();

    res.status(201).json({
      message: 'RFP created successfully',
      rfp
    });
  } catch (error) {
    console.error('Create RFP error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update RFP
 * @route PUT /api/rfps/:id
 * @access Private/Manager+Admin
 */
exports.updateRFP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    description,
    client,
    status,
    category,
    budget,
    currency,
    submissionDeadline,
    startDate,
    endDate,
    requirements,
    complianceRequirements,
    evaluationCriteria,
    tags
  } = req.body;

  try {
    // Find RFP
    let rfp = await RFP.findById(req.params.id);

    if (!rfp) {
      return res.status(404).json({ message: 'RFP not found' });
    }

    // Build RFP object
    const rfpFields = {};
    if (title) rfpFields.title = title;
    if (description) rfpFields.description = description;
    if (client) rfpFields.client = client;
    if (status) rfpFields.status = status;
    if (category) rfpFields.category = category;
    if (budget) rfpFields.budget = budget;
    if (currency) rfpFields.currency = currency;
    if (submissionDeadline) rfpFields.submissionDeadline = submissionDeadline;
    if (startDate) rfpFields.startDate = startDate;
    if (endDate) rfpFields.endDate = endDate;
    if (requirements) rfpFields.requirements = requirements;
    if (complianceRequirements) rfpFields.complianceRequirements = complianceRequirements;
    if (evaluationCriteria) rfpFields.evaluationCriteria = evaluationCriteria;
    if (tags) rfpFields.tags = tags;

    // Add updatedBy field
    rfpFields.updatedBy = req.user.id;

    // Update RFP
    rfp = await RFP.findByIdAndUpdate(
      req.params.id,
      { $set: rfpFields },
      { new: true }
    ).populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      message: 'RFP updated successfully',
      rfp
    });
  } catch (error) {
    console.error('Update RFP error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'RFP not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete RFP
 * @route DELETE /api/rfps/:id
 * @access Private/Admin
 */
exports.deleteRFP = async (req, res) => {
  try {
    // Find RFP
    const rfp = await RFP.findById(req.params.id);

    if (!rfp) {
      return res.status(404).json({ message: 'RFP not found' });
    }

    // Check if there are bids associated with this RFP
    const bidsCount = await Bid.countDocuments({ rfp: req.params.id });
    if (bidsCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete RFP with associated bids. Delete the bids first or change the RFP status to cancelled.'
      });
    }

    // Delete attachments
    if (rfp.attachments && rfp.attachments.length > 0) {
      rfp.attachments.forEach(attachment => {
        const filePath = path.join(__dirname, '..', 'uploads', path.basename(attachment.path));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Delete RFP
    await RFP.findByIdAndDelete(req.params.id);

    res.json({ message: 'RFP deleted successfully' });
  } catch (error) {
    console.error('Delete RFP error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'RFP not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add attachment to RFP
 * @route POST /api/rfps/:id/attachments
 * @access Private/Manager+Admin
 */
exports.addAttachment = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Find RFP
    const rfp = await RFP.findById(req.params.id);

    if (!rfp) {
      // Delete uploaded file if RFP not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'RFP not found' });
    }

    // Create attachment object
    const attachment = {
      name: req.file.originalname,
      path: req.file.path,
      fileType: req.file.mimetype,
      size: req.file.size
    };

    // Add attachment to RFP
    rfp.attachments.push(attachment);
    rfp.updatedBy = req.user.id;

    await rfp.save();

    res.json({
      message: 'Attachment added successfully',
      attachment
    });
  } catch (error) {
    console.error('Add attachment error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'RFP not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete attachment from RFP
 * @route DELETE /api/rfps/:id/attachments/:attachmentId
 * @access Private/Manager+Admin
 */
exports.deleteAttachment = async (req, res) => {
  try {
    // Find RFP
    const rfp = await RFP.findById(req.params.id);

    if (!rfp) {
      return res.status(404).json({ message: 'RFP not found' });
    }

    // Find attachment
    const attachment = rfp.attachments.id(req.params.attachmentId);

    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', 'uploads', path.basename(attachment.path));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove attachment from RFP
    rfp.attachments.pull(req.params.attachmentId);
    rfp.updatedBy = req.user.id;

    await rfp.save();

    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Delete attachment error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'RFP or attachment not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add note to RFP
 * @route POST /api/rfps/:id/notes
 * @access Private
 */
exports.addNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content } = req.body;

  try {
    // Find RFP
    const rfp = await RFP.findById(req.params.id);

    if (!rfp) {
      return res.status(404).json({ message: 'RFP not found' });
    }

    // Create note object
    const note = {
      content,
      createdBy: req.user.id
    };

    // Add note to RFP
    rfp.notes.push(note);
    rfp.updatedBy = req.user.id;

    await rfp.save();

    // Populate user info for the new note
    await rfp.populate('notes.createdBy', 'name email');

    res.json({
      message: 'Note added successfully',
      note: rfp.notes[rfp.notes.length - 1]
    });
  } catch (error) {
    console.error('Add note error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'RFP not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get RFP statistics
 * @route GET /api/rfps/stats
 * @access Private
 */
exports.getRFPStats = async (req, res) => {
  try {
    // Get total RFPs count
    const totalRFPs = await RFP.countDocuments();

    // Get RFPs by status
    const draftCount = await RFP.countDocuments({ status: 'draft' });
    const publishedCount = await RFP.countDocuments({ status: 'published' });
    const activeCount = await RFP.countDocuments({ status: 'active' });
    const closedCount = await RFP.countDocuments({ status: 'closed' });
    const awardedCount = await RFP.countDocuments({ status: 'awarded' });
    const cancelledCount = await RFP.countDocuments({ status: 'cancelled' });

    // Get RFPs by category
    const categories = await RFP.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent RFPs (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRFPs = await RFP.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get upcoming deadlines (next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingDeadlines = await RFP.countDocuments({
      submissionDeadline: {
        $gte: today,
        $lte: nextWeek
      },
      status: { $in: ['published', 'active'] }
    });

    res.json({
      totalRFPs,
      byStatus: {
        draft: draftCount,
        published: publishedCount,
        active: activeCount,
        closed: closedCount,
        awarded: awardedCount,
        cancelled: cancelledCount
      },
      byCategory: categories,
      recentRFPs,
      upcomingDeadlines
    });
  } catch (error) {
    console.error('Get RFP stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
