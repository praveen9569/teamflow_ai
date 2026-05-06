const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const { success, error } = require('../utils/response');

const getProjects = async (req, res, next) => {
  try {
    const query =
      req.user.role === 'admin'
        ? {}
        : { members: req.user._id };

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort({ updatedAt: -1 });

    return success(res, { projects });
  } catch (err) {
    next(err);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!project) return error(res, 'Project not found', 404);

    const isMember = project.members.some((m) => m._id.equals(req.user._id));
    if (!isMember && req.user.role !== 'admin') {
      return error(res, 'You are not a member of this project', 403);
    }

    return success(res, { project });
  } catch (err) {
    next(err);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { title, description, deadline, color, memberIds } = req.body;

    const project = await Project.create({
      title,
      description,
      deadline,
      color,
      owner: req.user._id,
      members: memberIds || [],
    });

    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    return success(res, { project }, 'Project created', 201);
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return error(res, 'Project not found', 404);

    if (!project.owner.equals(req.user._id) && req.user.role !== 'admin') {
      return error(res, 'Only the project owner or admin can update this project', 403);
    }

    const allowed = ['title', 'description', 'deadline', 'color', 'status', 'members'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) project[field] = req.body[field];
    });

    await project.save();
    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    return success(res, { project }, 'Project updated');
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return error(res, 'Project not found', 404);

    if (!project.owner.equals(req.user._id) && req.user.role !== 'admin') {
      return error(res, 'Only the project owner or admin can delete this project', 403);
    }

    // Cascade delete tasks
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    return success(res, null, 'Project deleted');
  } catch (err) {
    next(err);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return error(res, 'Project not found', 404);

    const user = await User.findById(userId);
    if (!user) return error(res, 'User not found', 404);

    if (project.members.includes(userId)) {
      return error(res, 'User is already a member', 400);
    }

    project.members.push(userId);
    await project.save();
    await project.populate('members', 'name email avatar');

    return success(res, { project }, 'Member added');
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const project = await Project.findById(req.params.id);
    if (!project) return error(res, 'Project not found', 404);

    if (project.owner.equals(userId)) {
      return error(res, 'Cannot remove the project owner', 400);
    }

    project.members = project.members.filter((m) => !m.equals(userId));
    await project.save();

    return success(res, null, 'Member removed');
  } catch (err) {
    next(err);
  }
};

const getProjectStats = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const tasks = await Task.find({ project: projectId });

    const stats = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
      overdue: tasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
      ).length,
    };

    return success(res, { stats });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectStats,
};
