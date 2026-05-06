const { generateTaskDescription, suggestPriority, getMultipleTips } = require('../services/aiService');
const { success } = require('../utils/response');

const getTaskDescription = (req, res) => {
  const { title } = req.query;
  const description = generateTaskDescription(title || '');
  return success(res, { description });
};

const getPrioritySuggestion = (req, res) => {
  const { dueDate, projectDeadline } = req.query;
  const priority = suggestPriority(dueDate, projectDeadline);
  return success(res, { priority });
};

const getProductivityTips = (req, res) => {
  const tips = getMultipleTips(3);
  return success(res, { tips });
};

module.exports = { getTaskDescription, getPrioritySuggestion, getProductivityTips };
