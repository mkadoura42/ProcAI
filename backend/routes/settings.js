const express = require('express');
const { check } = require('express-validator');
const settingsController = require('../controllers/settingsController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/settings
 * @desc    Get all settings
 * @access  Private/Admin
 */
router.get('/', [auth, adminOnly], settingsController.getAllSettings);

/**
 * @route   GET /api/settings/reference-codes
 * @desc    Get reference code settings
 * @access  Private
 */
router.get('/reference-codes', auth, settingsController.getReferenceCodeSettings);

/**
 * @route   POST /api/settings/initialize
 * @desc    Initialize default settings
 * @access  Private/Admin
 */
router.post('/initialize', [auth, adminOnly], settingsController.initializeSettings);

/**
 * @route   GET /api/settings/:category
 * @desc    Get settings by category
 * @access  Private/Admin
 */
router.get('/:category', [auth, adminOnly], settingsController.getSettingsByCategory);

/**
 * @route   GET /api/settings/:category/:key
 * @desc    Get setting by key
 * @access  Private/Admin
 */
router.get('/:category/:key', [auth, adminOnly], settingsController.getSettingByKey);

/**
 * @route   PUT /api/settings/:category/:key
 * @desc    Create or update setting
 * @access  Private/Admin
 */
router.put(
  '/:category/:key',
  [
    auth,
    adminOnly,
    check('value', 'Value is required').exists(),
    check('isEncrypted', 'isEncrypted must be a boolean').optional().isBoolean()
  ],
  settingsController.updateSetting
);

/**
 * @route   DELETE /api/settings/:category/:key
 * @desc    Delete setting
 * @access  Private/Admin
 */
router.delete('/:category/:key', [auth, adminOnly], settingsController.deleteSetting);

module.exports = router;
