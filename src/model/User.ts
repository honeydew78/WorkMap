import mongoose, { Schema, Document } from 'mongoose';

// Message Interface and Schema remain the same
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Updated User Interface without the 'role' field
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
  
  // Member fields (except 'role') added to User
  name: string;
  isActive: boolean;
  projects: mongoose.Types.ObjectId[];
  tasks: mongoose.Types.ObjectId[];
}

// Updated User Schema without the 'role' field
const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  verifyCode: {
    type: String,
    required: [true, 'Verify Code is required'],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, 'Verify Code Expiry is required'],
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],

  // Member fields 
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);

export default UserModel;
