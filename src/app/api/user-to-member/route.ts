import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import MemberModel from '@/model/Member';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User ID and role are required.',
        }),
        { status: 400 }
      );
    }

    if (!['Developer', 'Manager', 'Designer'].includes(role)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid role specified.',
        }),
        { status: 400 }
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User not found.',
        }),
        { status: 404 }
      );
    }

    const newMember = new MemberModel({
      name: user.username,
      email: user.email,
      role: role,
      isActive: true,
      projects: [], 
      tasks: [],    
    });

    await newMember.save();

    user.isAcceptingMessages = false; 
    await user.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User successfully converted to a member.',
        member: newMember,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error converting user to member:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error converting user to member.',
      }),
      { status: 500 }
    );
  }
}
