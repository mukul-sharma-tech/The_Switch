import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from '@/lib/mongodb';
import { Community } from '@/models/Community';
import { User } from '@/models/User';

// Leave a community
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Not Authorized' }, { status: 401 });
  }

  await connectToDB();

  try {
    const community = await Community.findOne({ slug });
    
    if (!community) {
      return NextResponse.json({ message: 'Community not found' }, { status: 404 });
    }

    // Check if user is the creator
    if (community.creator.toString() === session.user.id) {
      return NextResponse.json({ message: 'Creator cannot leave the community. Transfer ownership or delete the community instead.' }, { status: 400 });
    }

    // Check if user is a member
    if (!community.members.includes(session.user.id as any)) {
      return NextResponse.json({ message: 'You are not a member of this community' }, { status: 400 });
    }

    // Remove user from members
    community.members = community.members.filter(
      (memberId: any) => memberId.toString() !== session.user.id
    );
    community.memberCount = community.members.length;
    
    // Remove from moderators if present
    community.moderators = community.moderators.filter(
      (modId: any) => modId.toString() !== session.user.id
    );
    
    await community.save();

    // Remove community from user's communities
    await User.findByIdAndUpdate(session.user.id, {
      $pull: { communities: community._id }
    });

    return NextResponse.json({ message: 'Successfully left the community' }, { status: 200 });
  } catch (error) {
    console.error('Error leaving community:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

