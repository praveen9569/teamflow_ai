/**
 * Mock AI service — no external APIs.
 * Provides realistic-feeling AI features using heuristics and
 * curated content banks. Swap these out with real LLM calls later.
 */

const taskDescriptionTemplates = {
  design: [
    'Create wireframes and high-fidelity mockups. Define typography, color tokens, and component variants in the design system. Ensure accessibility (WCAG AA) is met.',
    'Research competitor UX patterns and user pain points. Sketch multiple layout options and iterate based on team feedback before moving to production assets.',
  ],
  api: [
    'Define the RESTful endpoint contract, request/response schema, and authentication requirements. Implement input validation and write integration tests.',
    'Implement the endpoint with proper error handling, rate limiting, and response caching where appropriate. Document with OpenAPI/Swagger.',
  ],
  bug: [
    'Reproduce the issue consistently in the local environment. Identify the root cause through debugging and logs. Write a regression test before applying the fix.',
    'Analyze error traces and relevant user reports. Isolate the problematic module, apply the minimal fix, and verify no side effects in related flows.',
  ],
  test: [
    'Write unit tests covering happy path, edge cases, and error scenarios. Aim for meaningful coverage, not just percentage. Mock external dependencies.',
    'Set up end-to-end tests using the agreed framework. Cover the critical user journeys and run them in CI on every PR.',
  ],
  feature: [
    'Break down the feature into sub-tasks. Align with design specs and backend contracts before writing code. Update docs and notify stakeholders after merging.',
    'Implement the feature behind a feature flag for gradual rollout. Include error boundaries, loading states, and empty states in the UI layer.',
  ],
  default: [
    'Define acceptance criteria with the team before starting. Implement changes incrementally and keep commits focused. Update relevant documentation.',
    'Coordinate with stakeholders to confirm requirements. Build in small, reviewable pieces and ensure proper test coverage before marking as done.',
  ],
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateTaskDescription = (title = '') => {
  const lower = title.toLowerCase();
  let bucket = 'default';

  if (/design|ui|ux|wireframe|mockup|figma/.test(lower)) bucket = 'design';
  else if (/api|endpoint|route|service|backend/.test(lower)) bucket = 'api';
  else if (/bug|fix|error|issue|crash|broken/.test(lower)) bucket = 'bug';
  else if (/test|spec|coverage|e2e|unit/.test(lower)) bucket = 'test';
  else if (/feature|add|implement|build|create/.test(lower)) bucket = 'feature';

  return pickRandom(taskDescriptionTemplates[bucket]);
};

const suggestPriority = (dueDate, projectDeadline) => {
  const now = Date.now();
  const taskDue = dueDate ? new Date(dueDate).getTime() : null;
  const projDue = projectDeadline ? new Date(projectDeadline).getTime() : null;

  const dayMs = 24 * 60 * 60 * 1000;

  if (taskDue) {
    const daysLeft = (taskDue - now) / dayMs;
    if (daysLeft < 1) return 'urgent';
    if (daysLeft < 3) return 'high';
    if (daysLeft < 7) return 'medium';
    return 'low';
  }

  if (projDue) {
    const daysLeft = (projDue - now) / dayMs;
    if (daysLeft < 3) return 'high';
    if (daysLeft < 14) return 'medium';
  }

  return 'medium';
};

const productivityTips = [
  { tip: 'Time-box your deep work sessions to 90 minutes, then take a real break.', category: 'Focus' },
  { tip: "Start each day by identifying your single most important task — don't let it slip past noon.", category: 'Planning' },
  { tip: 'Batch similar tasks together to reduce context-switching overhead.', category: 'Efficiency' },
  { tip: 'Use async communication for non-urgent matters to protect your flow state.', category: 'Communication' },
  { tip: 'Review open tasks every Friday so Monday has clarity, not chaos.', category: 'Planning' },
  { tip: 'Break tasks that feel overwhelming into steps you can finish in under 25 minutes.', category: 'Focus' },
  { tip: 'Document decisions and their rationale in the task — your future self will thank you.', category: 'Documentation' },
  { tip: 'Set clear definition-of-done criteria before you start a task, not after.', category: 'Quality' },
  { tip: "When blocked, write out exactly what you're stuck on before asking for help — often the answer surfaces.", category: 'Problem Solving' },
  { tip: 'Use overdue tasks as a signal to reassess scope, not just to work longer hours.', category: 'Planning' },
];

const getProductivityTip = () => pickRandom(productivityTips);

const getMultipleTips = (count = 3) => {
  const shuffled = [...productivityTips].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

module.exports = {
  generateTaskDescription,
  suggestPriority,
  getProductivityTip,
  getMultipleTips,
};
