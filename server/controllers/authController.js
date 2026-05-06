const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return error(res, 'Email already in use', 409);
    }

    const user = await User.create({ name, email, password, role: role || 'member' });

    const token = signToken({ id: user._id, role: user.role });

    return success(res, { user, token }, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return error(res, 'Invalid email or password', 401);
    }

    const token = signToken({ id: user._id, role: user.role });

    // Don't send the hashed password back
    user.password = undefined;

    return success(res, { user, token }, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  return success(res, { user: req.user });
};

module.exports = { register, login, getMe };
