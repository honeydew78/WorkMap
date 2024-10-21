import dbConnect from '@/lib/dbConnect';
import ProjectModel from '@/model/Project';
import { POST as convertUserToMember } from '@/app/api/user-to-member/route';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, description, members, tasks, creatorId, role } = await request.json();

    if (!creatorId || !role) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Creator ID and role are required.',
        }),
        { status: 400 }
      );
    }

    const conversionRequest = new Request('', {
      method: 'POST',
      body: JSON.stringify({
        userId: creatorId,
        role: role,
      }),
    });

    const conversionResponse = await convertUserToMember(conversionRequest);
    const conversionResult = await conversionResponse.json();

    if (!conversionResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: conversionResult.message,
        }),
        { status: 400 }
      );
    }

    const creatorAsMember = conversionResult.member;

    const newProject = new ProjectModel({
      name,
      description,
      members: members ? [...members, creatorAsMember._id] : [creatorAsMember._id], 
      tasks: tasks || [], 
      projectLeads: [creatorAsMember._id], 
      reports: [], 
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
