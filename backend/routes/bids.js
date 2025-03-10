const express = require('express');
const { check } = require('express-validator');
const multer = require('multer');
const bidController = require('../controllers/bidController');
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
 * @route   GET /api/bids
 * @desc    Get all bids
 * @access  Private
 */
router.get('/', auth, bidController.getAllBids);

/**
 * @route   GET /api/bids/stats
 * @desc    Get bid statistics
 * @access  Private
 */
router.get('/stats', auth, bidController.getBidStats);

/**
 * @route   GET /api/bids/rfp/:rfpId
 * @desc    Get bids by RFP ID
 * @access  Private
 */
router.get('/rfp/:rfpId', auth, bidController.getBidsByRFP);

/**
 * @route   GET /api/bids/:id
 * @desc    Get bid by ID
 * @access  Private
 */
router.get('/:id', auth, bidController.getBidById);

/**
 * @route   POST /api/bids
 * @desc    Create a new bid
 * @access  Private/Manager+Admin
 */
router.post(
  '/',
  [
    auth,
    managerOrAdmin,
    check('rfp', 'RFP ID is required').not().isEmpty(),
    check('vendor', 'Vendor information is required').not().isEmpty(),
    check('vendor.name', 'Vendor name is required').not().isEmpty(),
    check('totalAmount', 'Total amount is required').isNumeric()
  ],
  bidController.createBid
);

/**
 * @route   PUT /api/bids/:id
 * @desc    Update bid
 * @access  Private/Manager+Admin
 */
router.put(
  '/:id',
  [
    auth,
    managerOrAdmin,
    check('vendor', 'Vendor information is required').optional().not().isEmpty(),
    check('vendor.name', 'Vendor name is required').optional().not().isEmpty(),
    check('totalAmount', 'Total amount is required').optional().isNumeric(),
    check('status', 'Status must be valid').optional().isIn(['received', 'under-review', 'shortlisted', 'rejected', 'accepted'])
  ],
  bidController.updateBid
);

/**
 * @route   DELETE /api/bids/:id
 * @desc    Delete bid
 * @access  Private/Admin
 */
router.delete('/:id', [auth, managerOrAdmin], bidController.deleteBid);

/**
 * @route   POST /api/bids/:id/attachments
 * @desc    Add attachment to bid
 * @access  Private/Manager+Admin
 */
router.post(
  '/:id/attachments',
  [auth, managerOrAdmin, upload.single('file')],
  bidController.addAttachment
);

/**
 * @route   DELETE /api/bids/:id/attachments/:attachmentId
 * @desc    Delete attachment from bid
 * @access  Private/Manager+Admin
 */
router.delete(
  '/:id/attachments/:attachmentId',
  [auth, managerOrAdmin],
  bidController.deleteAttachment
);

/**
 * @route   POST /api/bids/:id/evaluation
 * @desc    Add evaluation note to bid
 * @access  Private/Manager+Admin
 */
router.post(
  '/:id/evaluation',
  [
    auth,
    managerOrAdmin,
    check('criterion', 'Criterion is required').not().isEmpty(),
    check('score', 'Score is required').isNumeric(),
    check('notes', 'Notes are required').not().isEmpty()
  ],
  bidController.addEvaluationNote
);

/**
 * @route   POST /api/bids/:id/notes
 * @desc    Add note to bid
 * @access  Private
 */
router.post(
  '/:id/notes',
  [
    auth,
    check('content', 'Note content is required').not().isEmpty()
  ],
  bidController.addNote
);

module.exports = router;
