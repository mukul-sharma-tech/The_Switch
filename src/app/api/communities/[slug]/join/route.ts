import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from '@/lib/mongodb';
import { Community } from '@/models/Community';
import { User } from '@/models/User';

// Join a community
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

    // Check if user is already a member
    if (community.members.includes(session.user.id as any)) {
      return NextResponse.json({ message: 'You are already a member of this community' }, { status: 400 });
    }

    // Add user to members
    community.members.push(session.user.id as any);
    community.memberCount = community.members.length;
    await community.save();

    // Add community to user's communities
    await User.findByIdAndUpdate(session.user.id, {
      $push: { communities: community._id }
    });

    const updatedCommunity = await Community.findById(community._id)
      .populate('creator', 'name username profileImage')
      .lean();

    return NextResponse.json(updatedCommunity, { status: 200 });
  } catch (error) {
    console.error('Error joining community:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

