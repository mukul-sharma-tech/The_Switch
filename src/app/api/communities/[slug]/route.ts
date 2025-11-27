import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/authOptions";
import { connectToDB } from '@/lib/mongodb';
import { Community } from '@/models/Community';
import type { Session } from 'next-auth';

// Get a single community by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  await connectToDB();

  try {
    const community = await Community.findOne({ slug })
      .populate('creator', 'name username profileImage')
      .populate('members', 'name username profileImage')
      .populate('moderators', 'name username profileImage')
      .lean();

    if (!community) {
      return NextResponse.json({ message: 'Community not found' }, { status: 404 });
    }

    return NextResponse.json(community, { status: 200 });
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Update community (creator only)
export async function PUT(
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

    // Check if user is the creator
    if (community.creator.toString() !== userId) {
      return NextResponse.json({ message: 'Only the creator can update this community' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, category, interests, isPublic, allowMemberPosts, requireApproval, coverImage, icon } = body;

    // Update fields
    if (name !== undefined) {
      community.name = name.trim();
      // Regenerate slug if name changed
      const newSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Check if new slug exists (and is not current community)
      const existingCommunity = await Community.findOne({ slug: newSlug, _id: { $ne: community._id } });
      if (existingCommunity) {
        return NextResponse.json({ message: 'A community with this name already exists' }, { status: 400 });
      }
      community.slug = newSlug;
    }

    if (description !== undefined) community.description = description.trim();
    if (category !== undefined) community.category = category;
    if (interests !== undefined) community.interests = interests;
    if (isPublic !== undefined) community.isPublic = isPublic;
    if (allowMemberPosts !== undefined) community.allowMemberPosts = allowMemberPosts;
    if (requireApproval !== undefined) community.requireApproval = requireApproval;
    if (coverImage !== undefined) community.coverImage = coverImage;
    if (icon !== undefined) community.icon = icon;

    await community.save();

    const updatedCommunity = await Community.findById(community._id)
      .populate('creator', 'name username profileImage')
      .populate('members', 'name username profileImage')
      .lean();

    return NextResponse.json(updatedCommunity, { status: 200 });
  } catch (error: unknown) {
    console.error('Error updating community:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json({ message: 'A community with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

