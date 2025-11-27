import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { User } from '@/models/User';
import { Comment } from '@/models/Comment';
import type { Session } from 'next-auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions) as Session | null;
  if (!session?.user?.id || !(session.user as { gender?: string }).gender) {
    return NextResponse.json({ message: 'Not Authorized or session is missing user data' }, { status: 401 });
  }

  const authorId = (session.user as { id: string }).id;
  const authorGender = (session.user as { gender: string }).gender;

  await connectToDB();

  try {
    const body = await request.json();
    
    // ✅ DEBUG: Log the entire body received from the frontend
    console.log("--- RECEIVED REQUEST BODY ---", body);

    const { text, photo, video, topics, tags, space } = body;
    
    if (!text && !photo && !video) {
        return NextResponse.json({ message: 'Post must contain text, a photo, or a video.' }, { status: 400 });
    }

    const requestedSpace = space || 'common';
    // Allow posting in anonymous space for all users, or in common space, or in user's own gender space
    if (requestedSpace !== 'common' && requestedSpace !== 'anonymous' && requestedSpace !== authorGender) {
        return NextResponse.json({ message: `You are not permitted to post in the '${requestedSpace}' space.` }, { status: 403 });
    }

    const postDataToSave = {
      author: authorId,
      text,
      photo,
      video,
      topics: topics || [],
      tags: tags || [],
      space: requestedSpace,
      // space: 'male',
    };

    // ✅ DEBUG: Log the exact object we are about to save
    console.log("--- DATA TO BE SAVED ---", postDataToSave);

    const newPost = new Post(postDataToSave);
    await newPost.save();

    await User.findByIdAndUpdate(
      authorId,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    const populatedPost = await Post.findById(newPost._id).populate('author', 'name username profileImage gender').lean();

    return NextResponse.json(populatedPost, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// GET handler remains the same
export async function GET() {
  await connectToDB();
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate([
        { path: 'author', model: User, select: 'name username profileImage gender' },
        { path: 'comments', model: Comment, populate: { path: 'author', model: User, select: 'name username profileImage' } }
      ])
      .lean();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('--- CRITICAL ERROR fetching posts ---', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}