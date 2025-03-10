const express = require('express');
const { check } = require('express-validator');
const multer = require('multer');
const rfpController = require('../controllers/rfpController');
const { auth, managerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

/**
 * @route   GET /api/rfps
 * @desc    Get all RFPs
 * @access  Private
 */
router.get('/', auth, rfpController.getAllRFPs);

/**
 * @route   GET /api/rfps/stats
 * @desc    Get RFP statistics
 * @access  Private
 */
router.get('/stats', auth, rfpController.getRFPStats);

/**
 * @route   GET /api/rfps/:id
 * @desc    Get RFP by ID
 * @access  Private
 */
router.get('/:id', auth, rfpController.getRFPById);

/**
 * @route   POST /api/rfps
 * @desc    Create a new RFP
 * @access  Private/Manager+Admin
 */
router.post(
  '/',
  [
    auth,
    managerOrAdmin,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('client', 'Client is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('submissionDeadline', 'Submission deadline is required').not().isEmpty()
  ],
  rfpController.createRFP
);

/**
 * @route   PUT /api/rfps/:id
 * @desc    Update RFP
 * @access  Private/Manager+Admin
 */
router.put(
  '/:id',
  [
    auth,
    managerOrAdmin,
    check('title', 'Title is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty(),
    check('client', 'Client is required').optional().not().isEmpty(),
    check('category', 'Category is required').optional().not().isEmpty(),
    check('status', 'Status must be valid').optional().isIn(['draft', 'published', 'active', 'closed', 'awarded', 'cancelled'])
  ],
  rfpController.updateRFP
);

/**
 * @route   DELETE /api/rfps/:id
 * @desc    Delete RFP
 * @access  Private/Admin
 */
router.delete('/:id', [auth, managerOrAdmin], rfpController.deleteRFP);

/**
 * @route   POST /api/rfps/:id/attachments
 * @desc    Add attachment to RFP
 * @access  Private/Manager+Admin
 */
router.post(
  '/:id/attachments',
  [auth, managerOrAdmin, upload.single('file')],
  rfpController.addAttachment
);

/**
 * @route   DELETE /api/rfps/:id/attachments/:attachmentId
 * @desc    Delete attachment from RFP
 * @access  Private/Manager+Admin
 */
router.delete(
  '/:id/attachments/:attachmentId',
  [auth, managerOrAdmin],
  rfpController.deleteAttachment
);

/**
 * @route   POST /api/rfps/:id/notes
 * @desc    Add note to RFP
 * @access  Private
 */
router.post(
  '/:id/notes',
  [
    auth,
    check('content', 'Note content is required').not().isEmpty()
  ],
  rfpController.addNote
);

module.exports = router;
