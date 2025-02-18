import mongoose, { Schema, Document } from 'mongoose';

export interface Task extends Document {
  name: string;
  assignedTo: mongoose.Types.ObjectId[]; // Users assigned to this task
  status: 'active' | 'completed'; // Task status
}

export interface Project extends Document {
  name: string;
  description: string;
  teamLeads: mongoose.Types.ObjectId[]; // Multiple Team Leads
  members: mongoose.Types.ObjectId[]; // Multiple Members
  status: 'active' | 'completed'; // Project status
  tasks: Task[]; // List of tasks
}

const TaskSchema: Schema<Task> = new mongoose.Schema({
  name: { type: String, required: true },
  assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Users assigned to this task
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active' // Default task status
  }
});

const ProjectSchema: Schema<Project> = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  teamLeads: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Multiple team leads
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Multiple members
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active', // Default status is active
  },
  tasks: [TaskSchema] // Array of tasks inside the project
});

// Middleware to update project status when tasks are updated
ProjectSchema.pre('save', function (next) {
  const project = this as Project;
  if (project.tasks.length > 0 && project.tasks.every(task => task.status === 'completed')) {
    project.status = 'completed';
  } else {
    project.status = 'active';
  }
  next();
});

const ProjectModel = mongoose.model<Project>('Project', ProjectSchema);
export default ProjectModel;
