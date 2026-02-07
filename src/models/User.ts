import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  faceEmbedding: { type: [Number], required: false },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
