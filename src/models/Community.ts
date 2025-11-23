import mongoose, { Schema, model, models } from 'mongoose';

const CommunitySchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  slug: { type: String, unique: true, required: true, lowercase: true }, // URL-friendly identifier
  
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Members
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Additional admins
  
  // Settings
  isPublic: { type: Boolean, default: true }, // Public communities can be discovered, private ones require invite
  allowMemberPosts: { type: Boolean, default: true }, // Whether members can post (creator can always post)
  requireApproval: { type: Boolean, default: false }, // Whether new posts need approval
  
  // Community type/category
  category: { type: String, default: 'general' }, // e.g., 'creator', 'organization', 'school', 'company', 'general'
  interests: [{ type: String }], // Tags for discovery
  
  // Media
  coverImage: { type: String, default: '' },
  icon: { type: String, default: '' },
  
  // Posts in this community
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  
  // Stats
  memberCount: { type: Number, default: 0 },
  postCount: { type: Number, default: 0 },
  
}, { timestamps: true });

// Index for faster queries
CommunitySchema.index({ slug: 1 });
CommunitySchema.index({ creator: 1 });
CommunitySchema.index({ members: 1 });
CommunitySchema.index({ category: 1 });
CommunitySchema.index({ interests: 1 });

export const Community = models.Community || model('Community', CommunitySchema);

