const router = require('express').Router();
const { getTaskDescription, getPrioritySuggestion, getProductivityTips } = require('../controllers/aiController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.get('/task-description', getTaskDescription);
router.get('/suggest-priority', getPrioritySuggestion);
router.get('/productivity-tips', getProductivityTips);

module.exports = router;
