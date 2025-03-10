const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { auth, adminOnly, managerOrAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/', [auth, adminOnly], userController.getAllUsers);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private/Admin
 */
router.get('/stats', [auth, adminOnly], userController.getUserStats);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private/Admin
 */
router.get('/:id', [auth, adminOnly], userController.getUserById);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Private/Admin
 */
router.post(
  '/',
  [
    auth,
    adminOnly,
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('role', 'Role must be admin, manager, or viewer').isIn(['admin', 'manager', 'viewer'])
  ],
  userController.createUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private/Admin
 */
router.put(
  '/:id',
  [
    auth,
    adminOnly,
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('role', 'Role must be admin, manager, or viewer').optional().isIn(['admin', 'manager', 'viewer']),
    check('isActive', 'isActive must be a boolean').optional().isBoolean()
  ],
  userController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/:id', [auth, adminOnly], userController.deleteUser);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile (for current user)
 * @access  Private
 */
router.put(
  '/profile',
  [
    auth,
    check('name', 'Name is required').optional().not().isEmpty(),
    check('department', 'Department is required').optional().not().isEmpty(),
    check('position', 'Position is required').optional().not().isEmpty()
  ],
  userController.updateProfile
);

module.exports = router;
