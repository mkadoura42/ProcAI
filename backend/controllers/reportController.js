const { validationResult } = require('express-validator');
const Report = require('../models/Report');
const RFP = require('../models/RFP');
const Bid = require('../models/Bid');
const fs = require('fs');
const path = require('path');

/**
 * Get all reports
 * @route GET /api/reports
 * @access Private
 */
exports.getAllReports = async (req, res) => {
  try {
    // Parse query parameters for filtering
    const { type, relatedRFP, relatedBid, generatedBy, search, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};

    if (type) filter.type = type;
    if (relatedRFP) filter.relatedRFP = relatedRFP;
    if (relatedBid) filter.relatedBids = relatedBid;
    if (generatedBy) filter.generatedBy = generatedBy;

    // Search in title, reference number, or summary
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { referenceNumber: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
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

    // Get reports with pagination
    const reports = await Report.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('relatedRFP', 'title referenceNumber')
      .populate('relatedBids', 'referenceNumber vendor.name')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('sharedWith.user', 'name email');

    // Get total count for pagination
    const total = await Report.countDocuments(filter);

    res.json({
      reports,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all reports error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get report by ID
 * @route GET /api/reports/:id
 * @access Private
 */
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('relatedRFP', 'title referenceNumber client category')
      .populate('relatedBids', 'referenceNumber vendor.name totalAmount status')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('sharedWith.user', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has access to the report
    const isOwner = report.createdBy._id.toString() === req.user.id;
    const isSharedWithUser = report.sharedWith.some(share => share.user._id.toString() === req.user.id);
    const isPublic = report.isPublic;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isSharedWithUser && !isPublic && !isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to access this report' });
    }

    res.json(report);
  } catch (error) {
    console.error('Get report by ID error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new report
 * @route POST /api/reports
 * @access Private
 */
exports.createReport = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    type,
    relatedRFP,
    relatedBids,
    generatedBy,
    aiModel,
    summary,
    content,
    score,
    findings,
    recommendations,
    chatHistory,
    tags,
    isPublic,
    referenceNumber
  } = req.body;

  try {
    // Validate related documents
    if (relatedRFP) {
      const rfp = await RFP.findById(relatedRFP);
      if (!rfp) {
        return res.status(404).json({ message: 'Related RFP not found' });
      }
    }

    if (relatedBids && relatedBids.length > 0) {
      for (const bidId of relatedBids) {
        const bid = await Bid.findById(bidId);
        if (!bid) {
          return res.status(404).json({ message: `Related Bid ${bidId} not found` });
        }
      }
    }

    // Get reference numbers for related documents
    let relatedRFPReference = '';
    let relatedBidReferences = [];

    if (relatedRFP) {
      const rfp = await RFP.findById(relatedRFP);
      relatedRFPReference = rfp.referenceNumber;
    }

    if (relatedBids && relatedBids.length > 0) {
      const bids = await Bid.find({ _id: { $in: relatedBids } });
      relatedBidReferences = bids.map(bid => bid.referenceNumber);
    }

    // Create new report
    const report = new Report({
      title,
      type,
      relatedRFP,
      relatedRFPReference,
      relatedBids,
      relatedBidReferences,
      generatedBy,
      aiModel: aiModel || 'GPT-4',
      summary,
      content,
      score,
      findings: findings || [],
      recommendations,
      chatHistory: chatHistory || [],
      createdBy: req.user.id,
      tags: tags || [],
      isPublic: isPublic || false,
      referenceNumber
    });

    // Save report to database
    await report.save();

    res.status(201).json({
      message: 'Report created successfully',
      report
    });
  } catch (error) {
    console.error('Create report error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update report
 * @route PUT /api/reports/:id
 * @access Private
 */
exports.updateReport = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    summary,
    content,
    score,
    findings,
    recommendations,
    status,
    tags,
    isPublic
  } = req.body;

  try {
    // Find report
    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has permission to update the report
    const isOwner = report.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isSharedWithEditAccess = report.sharedWith.some(
      share => share.user.toString() === req.user.id && share.accessLevel === 'edit'
    );

    if (!isOwner && !isAdmin && !isSharedWithEditAccess) {
      return res.status(403).json({ message: 'You do not have permission to update this report' });
    }

    // Build report object
    const reportFields = {};
    if (title) reportFields.title = title;
    if (summary) reportFields.summary = summary;
    if (content) reportFields.content = content;
    if (score !== undefined) reportFields.score = score;
    if (findings) reportFields.findings = findings;
    if (recommendations) reportFields.recommendations = recommendations;
    if (status) reportFields.status = status;
    if (tags) reportFields.tags = tags;
    if (isPublic !== undefined) reportFields.isPublic = isPublic;

    // Add updatedBy field
    reportFields.updatedBy = req.user.id;

    // Update report
    report = await Report.findByIdAndUpdate(
      req.params.id,
      { $set: reportFields },
      { new: true }
    ).populate('relatedRFP', 'title referenceNumber')
      .populate('relatedBids', 'referenceNumber vendor.name')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    console.error('Update report error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete report
 * @route DELETE /api/reports/:id
 * @access Private
 */
exports.deleteReport = async (req, res) => {
  try {
    // Find report
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has permission to delete the report
    const isOwner = report.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to delete this report' });
    }

    // Delete attachments
    if (report.attachments && report.attachments.length > 0) {
      report.attachments.forEach(attachment => {
        const filePath = path.join(__dirname, '..', 'uploads', path.basename(attachment.path));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Delete report
    await Report.findByIdAndDelete(req.params.id);

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add attachment to report
 * @route POST /api/reports/:id/attachments
 * @access Private
 */
exports.addAttachment = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Find report
    const report = await Report.findById(req.params.id);

    if (!report) {
      // Delete uploaded file if report not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has permission to update the report
    const isOwner = report.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isSharedWithEditAccess = report.sharedWith.some(
      share => share.user.toString() === req.user.id && share.accessLevel === 'edit'
    );

    if (!isOwner && !isAdmin && !isSharedWithEditAccess) {
      // Delete uploaded file if user doesn't have permission
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: 'You do not have permission to update this report' });
    }

    // Create attachment object
    const attachment = {
      name: req.file.originalname,
      path: req.file.path,
      fileType: req.file.mimetype,
      size: req.file.size
    };

    // Add attachment to report
    report.attachments.push(attachment);
    report.updatedBy = req.user.id;

    await report.save();

    res.json({
      message: 'Attachment added successfully',
      attachment
    });
  } catch (error) {
    console.error('Add attachment error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete attachment from report
 * @route DELETE /api/reports/:id/attachments/:attachmentId
 * @access Private
 */
exports.deleteAttachment = async (req, res) => {
  try {
    // Find report
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has permission to update the report
    const isOwner = report.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isSharedWithEditAccess = report.sharedWith.some(
      share => share.user.toString() === req.user.id && share.accessLevel === 'edit'
    );

    if (!isOwner && !isAdmin && !isSharedWithEditAccess) {
      return res.status(403).json({ message: 'You do not have permission to update this report' });
    }

    // Find attachment
    const attachment = report.attachments.id(req.params.attachmentId);

    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', 'uploads', path.basename(attachment.path));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove attachment from report
    report.attachments.pull(req.params.attachmentId);
    report.updatedBy = req.user.id;

    await report.save();

    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Delete attachment error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Report or attachment not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Share report with user
 * @route POST /api/reports/:id/share
 * @access Private
 */
exports.shareReport = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, accessLevel } = req.body;

  try {
    // Find report
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has permission to share the report
    const isOwner = report.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to share this report' });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if report is already shared with user
    const alreadyShared = report.sharedWith.some(share => share.user.toString() === userId);

    if (alreadyShared) {
      // Update access level if already shared
      report.sharedWith.forEach(share => {
        if (share.user.toString() === userId) {
          share.accessLevel = accessLevel;
          share.sharedAt = Date.now();
        }
      });
    } else {
      // Add new share
      report.sharedWith.push({
        user: userId,
        accessLevel,
        sharedAt: Date.now()
      });
    }

    report.updatedBy = req.user.id;
    await report.save();

    // Populate user info
    await report.populate('sharedWith.user', 'name email');

    res.json({
      message: 'Report shared successfully',
      sharedWith: report.sharedWith
    });
  } catch (error) {
    console.error('Share report error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Report or user not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Remove share from report
 * @route DELETE /api/reports/:id/share/:userId
 * @access Private
 */
exports.removeShare = async (req, res) => {
  try {
    // Find report
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has permission to update shares
    const isOwner = report.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to update shares for this report' });
    }

    // Check if report is shared with user
    const shareIndex = report.sharedWith.findIndex(share => share.user.toString() === req.params.userId);

    if (shareIndex === -1) {
      return res.status(404).json({ message: 'Share not found' });
    }

    // Remove share
    report.sharedWith.splice(shareIndex, 1);
    report.updatedBy = req.user.id;

    await report.save();

    res.json({
      message: 'Share removed successfully',
      sharedWith: report.sharedWith
    });
  } catch (error) {
    console.error('Remove share error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Report or user not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add chat message to report
 * @route POST /api/reports/:id/chat
 * @access Private
 */
exports.addChatMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { role, content, agent, model } = req.body;

  try {
    // Find report
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has permission to chat with the report
    const isOwner = report.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isSharedWithUser = report.sharedWith.some(share => share.user.toString() === req.user.id);
    const isPublic = report.isPublic;

    if (!isOwner && !isAdmin && !isSharedWithUser && !isPublic) {
      return res.status(403).json({ message: 'You do not have permission to chat with this report' });
    }

    // Create chat message object
    const chatMessage = {
      role,
      content,
      agent,
      model,
      timestamp: Date.now()
    };

    // Add chat message to report
    report.chatHistory.push(chatMessage);
    report.updatedBy = req.user.id;

    await report.save();

    res.json({
      message: 'Chat message added successfully',
      chatMessage
    });
  } catch (error) {
    console.error('Add chat message error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get report statistics
 * @route GET /api/reports/stats
 * @access Private
 */
exports.getReportStats = async (req, res) => {
  try {
    // Get total reports count
    const totalReports = await Report.countDocuments();

    // Get reports by type
    const rfpAnalysisCount = await Report.countDocuments({ type: 'rfp-analysis' });
    const bidEvaluationCount = await Report.countDocuments({ type: 'bid-evaluation' });
    const bidComparisonCount = await Report.countDocuments({ type: 'bid-comparison' });
    const complianceCheckCount = await Report.countDocuments({ type: 'compliance-check' });

    // Get reports by status
    const draftCount = await Report.countDocuments({ status: 'draft' });
    const finalCount = await Report.countDocuments({ status: 'final' });
    const archivedCount = await Report.countDocuments({ status: 'archived' });

    // Get reports by AI agent
    const complianceAgentCount = await Report.countDocuments({ generatedBy: 'compliance-agent' });
    const evaluationAgentCount = await Report.countDocuments({ generatedBy: 'evaluation-agent' });
    const comparativeAgentCount = await Report.countDocuments({ generatedBy: 'comparative-agent' });

    // Get recent reports (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentReports = await Report.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get average compliance score
    const avgResult = await Report.aggregate([
      { $match: { score: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);
    const averageScore = avgResult.length > 0 ? avgResult[0].avgScore : 0;

    res.json({
      totalReports,
      byType: {
        rfpAnalysis: rfpAnalysisCount,
        bidEvaluation: bidEvaluationCount,
        bidComparison: bidComparisonCount,
        complianceCheck: complianceCheckCount
      },
      byStatus: {
        draft: draftCount,
        final: finalCount,
        archived: archivedCount
      },
      byAgent: {
        complianceAgent: complianceAgentCount,
        evaluationAgent: evaluationAgentCount,
        comparativeAgent: comparativeAgentCount
      },
      recentReports,
      averageScore
    });
  } catch (error) {
    console.error('Get report stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
