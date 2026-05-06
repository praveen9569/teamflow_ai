const Task = require('../models/Task');
const Project = require('../models/Project');
const { success, error } = require('../utils/response');

const getTasks = async (req, res, next) => {
  try {
    const { projectId, status, priority, assignee, search, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (projectId) {
      filter.project = projectId;
    } else if (req.user.role !== 'admin') {
      // Members only see tasks from their projects
      const userProjects = await Project.find({ members: req.user._id }).select('_id');
      filter.project = { $in: userProjects.map((p) => p._id) };
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('assignee', 'name email avatar')
        .populate('createdBy', 'name email')
        .populate('project', 'title color')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Task.countDocuments(filter),
    ]);

    return success(res, { tasks, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'title color deadline');

    if (!task) return error(res, 'Task not found', 404);

    return success(res, { task });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, assignee, dueDate, tags, projectId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return error(res, 'Project not found', 404);

    // Check membership
    const isMember = project.members.some((m) => m.equals(req.user._id));
    if (!isMember && req.user.role !== 'admin') {
      return error(res, 'You are not a member of this project', 403);
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      assignee: assignee || null,
      dueDate: dueDate || null,
      tags: tags || [],
      project: projectId,
      createdBy: req.user._id,
    });

    await task.populate('assignee', 'name email avatar');
    await task.populate('createdBy', 'name email');
    await task.populate('project', 'title color');

    return success(res, { task }, 'Task created', 201);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return error(res, 'Task not found', 404);

    const isAssignee = task.assignee && task.assignee.equals(req.user._id);
    const isCreator = task.createdBy.equals(req.user._id);

    if (!isAssignee && !isCreator && req.user.role !== 'admin') {
      return error(res, 'You do not have permission to update this task', 403);
    }

    const allowed = ['title', 'description', 'status', 'priority', 'assignee', 'dueDate', 'tags'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();
    await task.populate('assignee', 'name email avatar');
    await task.populate('createdBy', 'name email');
    await task.populate('project', 'title color');

    return success(res, { task }, 'Task updated');
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return error(res, 'Task not found', 404);

    const isCreator = task.createdBy.equals(req.user._id);
    if (!isCreator && req.user.role !== 'admin') {
      return error(res, 'Only the task creator or admin can delete this task', 403);
    }

    await task.deleteOne();
    return success(res, null, 'Task deleted');
  } catch (err) {
    next(err);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();

    let projectFilter = {};
    let taskFilter = {};

    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({ members: req.user._id }).select('_id');
      const projectIds = userProjects.map((p) => p._id);
      projectFilter = { _id: { $in: projectIds } };
      taskFilter = { project: { $in: projectIds } };
    }

    const [totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([
      Project.countDocuments(projectFilter),
      Task.countDocuments(taskFilter),
      Task.countDocuments({ ...taskFilter, status: 'done' }),
      Task.countDocuments({ ...taskFilter, status: { $ne: 'done' } }),
      Task.countDocuments({
        ...taskFilter,
        dueDate: { $lt: now },
        status: { $ne: 'done' },
      }),
    ]);

    // Task breakdown by status for chart
    const tasksByStatus = await Task.aggregate([
      { $match: taskFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Recent tasks (last 7 days)
    const recentTasks = await Task.find({
      ...taskFilter,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    })
      .populate('assignee', 'name avatar')
      .populate('project', 'title color')
      .sort({ createdAt: -1 })
      .limit(8);

    return success(res, {
      stats: { totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks },
      tasksByStatus,
      recentTasks,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getDashboardStats };
