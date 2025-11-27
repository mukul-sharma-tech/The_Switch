import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from '@/lib/mongodb';
import { Community } from '@/models/Community';
import { User } from '@/models/User';
import type { Session } from 'next-auth';

// Create a new community
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions) as Session | null;
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Not Authorized' }, { status: 401 });
  }

  const userId = session.user.id;

  await connectToDB();

  try {
    const body = await request.json();
    const { name, description, category, interests, isPublic, allowMemberPosts, coverImage, icon } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ message: 'Community name is required' }, { status: 400 });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug already exists
    const existingCommunity = await Community.findOne({ slug });
    if (existingCommunity) {
      return NextResponse.json({ message: 'A community with this name already exists' }, { status: 400 });
    }

    const newCommunity = new Community({
      name: name.trim(),
      description: description?.trim() || '',
      slug,
      creator: userId,
      members: [userId], // Creator is automatically a member
      category: category || 'general',
      interests: interests || [],
      isPublic: isPublic !== undefined ? isPublic : true,
      allowMemberPosts: allowMemberPosts !== undefined ? allowMemberPosts : true,
      coverImage: coverImage || '',
      icon: icon || '',
      memberCount: 1,
    });

    await newCommunity.save();

    // Add community to user's createdCommunities and communities
    await User.findByIdAndUpdate(userId, {
      $push: { 
        createdCommunities: newCommunity._id,
        communities: newCommunity._id
      }
    });

    const populatedCommunity = await Community.findById(newCommunity._id)
      .populate('creator', 'name username profileImage')
      .lean();

    return NextResponse.json(populatedCommunity, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating community:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json({ message: 'A community with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Get all communities (with optional filters)
export async function GET(request: NextRequest) {
  await connectToDB();

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const interest = searchParams.get('interest');
    const search = searchParams.get('search');
    const isPublic = searchParams.get('isPublic');

    const query: Record<string, unknown> = {};

    if (category) {
      query.category = category;
    }

    if (interest) {
      query.interests = { $in: [interest] };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (isPublic === 'true') {
      query.isPublic = true;
    }

    const communities = await Community.find(query)
      .populate('creator', 'name username profileImage')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(communities, { status: 200 });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

