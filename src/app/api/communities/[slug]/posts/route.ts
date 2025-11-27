import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { Community } from '@/models/Community';
import { Post } from '@/models/Post';
import { User } from '@/models/User';
import { Comment } from '@/models/Comment';
import type { Session } from 'next-auth';

// Get posts in a community
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  await connectToDB();

  try {
    const community = await Community.findOne({ slug });
    
    if (!community) {
      return NextResponse.json({ message: 'Community not found' }, { status: 404 });
    }

    // Query posts by community field - use both community._id and community.posts array
    // First try using the community's posts array (more reliable)
    let posts: unknown[] = [];
    
    if (community.posts && community.posts.length > 0) {
      // Query posts by their IDs from the community's posts array
      posts = await Post.find({ 
        _id: { $in: community.posts }
      })
        .sort({ createdAt: -1 })
        .populate([
          { path: 'author', model: User, select: 'name username profileImage gender' },
          { path: 'comments', model: Comment, populate: { path: 'author', model: User, select: 'name username profileImage' } }
        ])
        .lean();
    }
    
    // Also query by community field to catch any posts that might not be in the array
    const postsByCommunityField = await Post.find({ 
      community: new mongoose.Types.ObjectId(community._id)
    })
      .sort({ createdAt: -1 })
      .populate([
        { path: 'author', model: User, select: 'name username profileImage gender' },
        { path: 'comments', model: Comment, populate: { path: 'author', model: User, select: 'name username profileImage' } }
      ])
      .lean();
    
    // Merge and deduplicate posts
    const allPosts = [...posts, ...postsByCommunityField];
    const uniquePosts = allPosts.filter((post, index, self) => {
      const postWithId = post as { _id: { toString(): string } };
      return index === self.findIndex((p) => {
        const pWithId = p as { _id: { toString(): string } };
        return pWithId._id.toString() === postWithId._id.toString();
      });
    });
    
    // Sort by creation date
    uniquePosts.sort((a, b) => {
      const aWithDate = a as { createdAt: string | Date };
      const bWithDate = b as { createdAt: string | Date };
      return new Date(bWithDate.createdAt).getTime() - new Date(aWithDate.createdAt).getTime();
    });

    console.log(`Found ${uniquePosts.length} posts for community ${community.name} (${community.slug})`);
    console.log(`- From posts array: ${posts.length}`);
    console.log(`- From community field: ${postsByCommunityField.length}`);
    
    return NextResponse.json(uniquePosts, { status: 200 });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Create a post in a community
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

    // Check if user is a member
    const isMember = community.members.some((memberId: unknown) => {
      return (memberId as { toString(): string }).toString() === userId;
    });
    const isCreator = community.creator.toString() === userId;
    const isModerator = community.moderators.some((modId: unknown) => {
      return (modId as { toString(): string }).toString() === userId;
    });

    if (!isMember && !isCreator) {
      return NextResponse.json({ message: 'You must be a member to post in this community' }, { status: 403 });
    }

    // Check posting permissions
    if (!isCreator && !isModerator && !community.allowMemberPosts) {
      return NextResponse.json({ message: 'Members are not allowed to post in this community' }, { status: 403 });
    }

    const body = await request.json();
    const { text, photo, video, topics, tags } = body;

    if (!text && !photo && !video) {
      return NextResponse.json({ message: 'Post must contain text, a photo, or a video.' }, { status: 400 });
    }

    const newPost = new Post({
      author: userId,
      text,
      photo,
      video,
      topics: topics || [],
      tags: tags || [],
      space: 'common', // Community posts use common space
      community: community._id,
    });

    await newPost.save();
    console.log(`Created post ${newPost._id} for community ${community._id} (${community.slug})`);

    // Add post to community
    if (!community.posts.includes(newPost._id)) {
      community.posts.push(newPost._id);
    }
    community.postCount = community.posts.length;
    await community.save();
    console.log(`Updated community ${community.slug} with post count: ${community.postCount}`);

    // Add post to user's posts
    await User.findByIdAndUpdate(userId, {
      $push: { posts: newPost._id }
    });

    const populatedPost = await Post.findById(newPost._id)
      .populate('author', 'name username profileImage gender')
      .lean();

    return NextResponse.json(populatedPost, { status: 201 });
  } catch (error) {
    console.error('Error creating community post:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

