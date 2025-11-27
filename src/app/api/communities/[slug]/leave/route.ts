import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from '@/lib/mongodb';
import { Community } from '@/models/Community';
import { User } from '@/models/User';
import type { Session } from 'next-auth';

// Leave a community
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const session = await getServerSession(authOptions) as Session | null;
  
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
    const userIdString = session.user.id;
    if (!community.members.some((memberId: { toString(): string }) => memberId.toString() === userIdString)) {
      return NextResponse.json({ message: 'You are not a member of this community' }, { status: 400 });
    }

    // Remove user from members
    community.members = community.members.filter(
      (memberId: { toString(): string }) => memberId.toString() !== userIdString
    );
    community.memberCount = community.members.length;
    
    // Remove from moderators if present
    community.moderators = community.moderators.filter(
      (modId: { toString(): string }) => modId.toString() !== userIdString
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

