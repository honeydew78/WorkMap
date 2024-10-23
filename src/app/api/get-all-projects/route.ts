import dbConnect from '@/lib/dbConnect';
import ProjectModel from '@/model/Project';
import UserModel from '@/model/User';

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User ID is required.',
        }),
        { status: 400 }
      );
    }

    // Check if the user exists
    const userExists = await UserModel.exists({ _id: userId });
    if (!userExists) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User not found.',
        }),
        { status: 404 }
      );
    }

    // Find all projects where the user is either a member or a project lead
    const projects = await ProjectModel.find({
      $or: [
        { members: userId },
        { projectLeads: userId },
      ],
    })
      .populate('members', 'username email') // Populate members with selected fields
      .populate('projectLeads', 'username email') // Populate project leads
      .populate('tasks', 'title description') // Populate tasks with selected fields
      .populate('reports', 'title content'); // Populate reports

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Projects retrieved successfully.',
        projects: projects,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error fetching projects.',
      }),
      { status: 500 }
    );
  }
}
