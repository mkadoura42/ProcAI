const express = require('express');
const { check } = require('express-validator');
const aiController = require('../controllers/aiController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/ai/analyze-rfp
 * @desc    Analyze RFP for compliance
 * @access  Private
 */
router.post(
  '/analyze-rfp',
  [
    auth,
    check('rfpId', 'RFP ID is required').not().isEmpty()
  ],
  aiController.analyzeRFP
);

/**
 * @route   POST /api/ai/evaluate-bid
 * @desc    Evaluate bid against RFP
 * @access  Private
 */
router.post(
  '/evaluate-bid',
  [
    auth,
    check('bidId', 'Bid ID is required').not().isEmpty()
  ],
  aiController.evaluateBid
);

/**
 * @route   POST /api/ai/compare-bids
 * @desc    Compare multiple bids for an RFP
 * @access  Private
 */
router.post(
  '/compare-bids',
  [
    auth,
    check('rfpId', 'RFP ID is required').not().isEmpty(),
    check('bidIds', 'At least 2 bid IDs are required').isArray({ min: 2 })
  ],
  aiController.compareBids
);

/**
 * @route   POST /api/ai/chat
 * @desc    Chat with AI about a document
 * @access  Private
 */
router.post(
  '/chat',
  [
    auth,
    check('reportId', 'Report ID is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty()
  ],
  aiController.chatWithAI
);

/**
 * @route   GET /api/ai/agents
 * @desc    Get AI agent settings
 * @access  Private
 */
router.get('/agents', auth, aiController.getAgentSettings);

/**
 * @route   PUT /api/ai/agents/:agentId
 * @desc    Update AI agent settings
 * @access  Private/Admin
 */
router.put(
  '/agents/:agentId',
  [
    auth,
    adminOnly,
    check('name', 'Name is required').optional().not().isEmpty(),
    check('model', 'Model is required').optional().not().isEmpty(),
    check('provider', 'Provider is required').optional().not().isEmpty(),
    check('systemPrompt', 'System prompt is required').optional().not().isEmpty(),
    check('temperature', 'Temperature must be a number between 0 and 1').optional().isFloat({ min: 0, max: 1 }),
    check('maxTokens', 'Max tokens must be a positive number').optional().isInt({ min: 1 }),
    check('isActive', 'isActive must be a boolean').optional().isBoolean()
  ],
  aiController.updateAgentSettings
);

/**
 * @route   GET /api/ai/models
 * @desc    Get available AI models
 * @access  Private
 */
router.get('/models', auth, aiController.getAvailableModels);

/**
 * @route   PUT /api/ai/models/:modelId
 * @desc    Update AI model settings
 * @access  Private/Admin
 */
router.put(
  '/models/:modelId',
  [
    auth,
    adminOnly,
    check('name', 'Name is required').optional().not().isEmpty(),
    check('provider', 'Provider is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty(),
    check('isActive', 'isActive must be a boolean').optional().isBoolean()
  ],
  aiController.updateModelSettings
);

module.exports = router;
