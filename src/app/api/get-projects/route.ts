import dbConnect from '@/lib/dbConnect';
import ProjectModel from '@/model/Project';
import mongoose from 'mongoose'; 

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

    // Step 1: Find the project by ID
    const project = await ProjectModel.findById(projectId)
      .populate('members', '_id name email')  
      .populate('projectLeads', '_id name email')  
      .populate('tasks', '_id title') 
      .populate('reports', '_id content'); 

    if (!project) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Project not found.',
        }),
        { status: 404 }
      );
    }

    const isMember = project.members.some(memberId => memberId.toString() === userId);
    const isProjectLead = project.projectLeads.some((lead: mongoose.Types.ObjectId) => lead.toString() === userId); // Use .some() to check leads

    if (!isMember && !isProjectLead) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Access denied. Only project members or team leads can view the project.',
        }),
        { status: 403 }
      );
    }

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
