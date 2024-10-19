import mongoose, { Schema, Document } from 'mongoose';

export interface Member extends Document {
  name: string;
  email: string;
  role: 'Developer' | 'Manager' | 'Designer';
  isActive: boolean;
  projects: mongoose.Types.ObjectId[];
  tasks: mongoose.Types.ObjectId[];
}

const MemberSchema: Schema<Member> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Member name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  role: {
    type: String,
    enum: ['Developer', 'Manager', 'Designer'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

const MemberModel =
  (mongoose.models.Member as mongoose.Model<Member>) ||
  mongoose.model<Member>('Member', MemberSchema);

export default MemberModel;
