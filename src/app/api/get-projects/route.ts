import dbConnect from '@/lib/dbConnect';
import ProjectModel from '@/model/Project';
import MemberModel from '@/model/Member';

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');

    if (!projectId || !userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Project ID and User ID are required.',
        }),
        { status: 400 }
      );
    }

    const project = await ProjectModel.findById(projectId)
      .populate('members', '_id name email')  // Populating members for better response
      .populate('projectLeads', '_id name email')  // Populating project leads
      .populate('tasks', '_id title')  // Populating tasks
      .populate('reports', '_id content');  // Populating reports

    if (!project) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Project not found.',
        }),
        { status: 404 }
      );
    }

    // Step 2: Verify if the user is either a project member or a project lead
    const isMember = project.members.some(memberId => memberId.toString() === userId);
    const isProjectLead = project.projectLeads.includes(userId);

    if (!isMember && !isProjectLead) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Access denied. Only project members or team leads can view the project.',
        }),
        { status: 403 }
      );
    }

    // Step 3: Return project details
    return new Response(
      JSON.stringify({
        success: true,
        project,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching project:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error fetching project.',
      }),
      { status: 500 }
    );
  }
}
