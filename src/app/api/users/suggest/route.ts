import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from "@/lib/mongodb";
import { User } from '@/models/User';
import type { Session } from 'next-auth';

export async function GET() {
  const session = await getServerSession(authOptions) as Session | null;
  const sessionUser = session?.user as { id?: string } | undefined;
  if (!sessionUser?.id) {
    // Return empty array if not logged in
    return NextResponse.json([], { status: 200 });
  }

  const userId = sessionUser.id;

  await connectToDB();

  try {
    const currentUser = await User.findById(userId).select('interests following');
    if (!currentUser) {
      return NextResponse.json([], { status: 200 });
    }

    const suggestions = await User.find({
      // Conditions for suggestions:
      _id: { 
        $ne: currentUser._id, // Not the current user
        $nin: currentUser.following // Not anyone the user already follows
      },
      // And has at least one interest in common
      interests: { $in: currentUser.interests }
    })
    .limit(5) // Suggest up to 5 users
    .select('name username profileImage'); // Only send public, necessary data

    return NextResponse.json(suggestions, { status: 200 });

  } catch (error) {
    console.error('Error fetching user suggestions:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}