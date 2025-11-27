import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from '@/lib/mongodb';
import { Community } from '@/models/Community';
import { User } from '@/models/User';
import mongoose from 'mongoose';
import type { Session } from 'next-auth';

// Join a community
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const session = await getServerSession(authOptions) as Session | null;
  
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Not Authorized' }, { status: 401 });
  }

  const userId = session.user.id;

  await connectToDB();

  try {
    const community = await Community.findOne({ slug });
    
    if (!community) {
      return NextResponse.json({ message: 'Community not found' }, { status: 404 });
    }

    // Check if user is already a member
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isAlreadyMember = community.members.some((memberId: unknown) => {
      return (memberId as { toString(): string }).toString() === userId;
    });
    if (isAlreadyMember) {
      return NextResponse.json({ message: 'You are already a member of this community' }, { status: 400 });
    }

    // Add user to members
    community.members.push(userObjectId);
    community.memberCount = community.members.length;
    await community.save();

    // Add community to user's communities
    await User.findByIdAndUpdate(userId, {
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

