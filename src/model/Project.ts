import mongoose, { Schema, Document } from 'mongoose';

export interface Project extends Document {
  name: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  tasks: mongoose.Types.ObjectId[];
}

const ProjectSchema: Schema<Project> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

const ProjectModel =
  (mongoose.models.Project as mongoose.Model<Project>) ||
  mongoose.model<Project>('Project', ProjectSchema);

export default ProjectModel;
