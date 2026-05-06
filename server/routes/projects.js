const router = require('express').Router();
const { body } = require('express-validator');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectStats,
} = require('../controllers/projectController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');

const createRules = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
];

router.use(authenticate);

router.get('/', getProjects);
router.post('/', createRules, validate, createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.get('/:id/stats', getProjectStats);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
