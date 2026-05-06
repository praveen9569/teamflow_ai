const router = require('express').Router();
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');
const { success } = require('../utils/response');

// Admins can fetch all users (for member assignment dropdowns)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const users = await User.find().select('name email avatar role').sort({ name: 1 });
    return success(res, { users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
