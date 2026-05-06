const router = require('express').Router();
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require('../controllers/taskController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');

const createRules = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('projectId').notEmpty().withMessage('Project ID is required'),
];

router.use(authenticate);

router.get('/dashboard', getDashboardStats);
router.get('/', getTasks);
router.post('/', createRules, validate, createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
