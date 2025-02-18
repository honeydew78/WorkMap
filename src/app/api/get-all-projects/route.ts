import dbConnect from '@/lib/dbConnect';
import ProjectModel from '@/model/Project';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  await dbConnect();
  
  // Get session and user details
  const session = await getServerSession(authOptions);
  const _user = session?.user;
//   console.log(_user);

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);
  // console.log(userId)

  try {
    // Fetch projects where the user is a team lead, member, or assigned to any task
    const projects = await ProjectModel.find({
      $or: [
        { teamLeads: userId },
        { members: userId },
        { 'tasks.assignedTo': userId }
      ]
    })
      .populate('teamLeads', 'username email')
      .populate('members', 'username email')
      .populate('tasks.assignedTo', 'username email');

    return Response.json(
      { success: true, projects },
      { status: 200 }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
