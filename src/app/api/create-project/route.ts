import dbConnect from '@/lib/dbConnect';
import ProjectModel from '@/model/Project';
import UserModel from '@/model/User';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, description, members, tasks, creatorId } = await request.json();

    if (!creatorId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Creator ID is required.',
        }),
        { status: 400 }
      );
    }

    // Find the creator by their user ID
    const creator = await UserModel.findById(creatorId);
    if (!creator) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Creator not found.',
        }),
        { status: 404 }
      );
    }

    const newProject = new ProjectModel({
      name,
      description,
      members: members ? [...members, creator._id] : [creator._id], // Add the creator to the project members
      tasks: tasks || [], // Set tasks if provided
      projectLeads: [creator._id], // Set the creator as the project lead
      reports: [], // Initialize with an empty reports array
    });

    await newProject.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Project created successfully',
        project: newProject,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error creating project',
      }),
      { status: 500 }
    );
  }
}
