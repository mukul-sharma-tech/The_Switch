import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from '@/lib/mongodb';
import { Community } from '@/models/Community';
import type { Session } from 'next-auth';

// Get all communities the user has joined
export async function GET() {
  const session = await getServerSession(authOptions) as Session | null;
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Not Authorized' }, { status: 401 });
  }

  await connectToDB();

  try {
    const communities = await Community.find({ members: session.user.id })
      .populate('creator', 'name username profileImage')
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(communities, { status: 200 });
  } catch (error) {
    console.error('Error fetching user communities:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

