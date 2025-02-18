import { Request, Response } from 'express';
import ProjectModel from '@/model/Project';

import { AuthenticatedRequest } from '../middleware/authMiddleware'; // Assuming you have an auth middleware

export const getAllProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id; // Get logged-in user ID from auth middleware

    // Fetch projects where the user is a team lead, member, or assigned to any task
    const projects = await ProjectModel.find({
      $or: [
        { teamLeads: userId },
        { members: userId },
        { 'tasks.assignedTo': userId }
      ]
    })
      .populate('teamLeads', 'username email') // Populate team leads
      .populate('members', 'username email') // Populate members
      .populate('tasks.assignedTo', 'username email'); // Populate assigned users in tasks

    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
