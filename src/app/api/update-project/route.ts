import dbConnect from '@/lib/dbConnect';
import ProjectModel from '@/model/Project';

export async function PUT(request: Request) {
  await dbConnect();

  try {
    const { projectId, userId, updatedData } = await request.json();

    if (!projectId || !userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Project ID and User ID are required.',
        }),
        { status: 400 }
      );
    }

    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Project not found.',
        }),
        { status: 404 }
      );
    }

    const isProjectLead = project.projectLeads.includes(userId);

    if (!isProjectLead) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Only project leads are allowed to update the project.',
        }),
        { status: 403 }
      );
    }

    const allowedUpdates: (keyof typeof project)[] = ['name', 'description', 'members', 'tasks', 'reports']; // Fields that can be updated
    allowedUpdates.forEach((field) => {
      if (updatedData[field] !== undefined) {
        (project as any)[field] = updatedData[field];
      }
    });

    await project.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Project updated successfully.',
        project,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating project:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error updating project.',
      }),
      { status: 500 }
    );
  }
}
