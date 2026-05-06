const { validationResult } = require('express-validator');

// Run this after your express-validator chains to catch any field errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return res.status(400).json({ success: false, message: messages[0], errors: messages });
  }
  next();
};

module.exports = validate;
