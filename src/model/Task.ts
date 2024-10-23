import mongoose, { Schema, Document } from 'mongoose';

export interface Task extends Document {
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Completed';
  assignedTo: mongoose.Types.ObjectId[]; // Array of members
  assignedBy: mongoose.Types.ObjectId[]; // Array of project leaders
  project: mongoose.Types.ObjectId;
  dueDate: Date;
}

const TaskSchema: Schema<Task> = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
  },
  status: {
    type: String,
    enum: ['Todo', 'In Progress', 'Completed'],
    default: 'Todo',
  },
  assignedTo: [{ // Array of members
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  assignedBy: [{ // Array of project leaders
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

const TaskModel =
  (mongoose.models.Task as mongoose.Model<Task>) ||
  mongoose.model<Task>('Task', TaskSchema);

export default TaskModel;
