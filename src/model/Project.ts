import mongoose, { Schema, Document } from 'mongoose';
import { Report } from './Report'; // Assuming Report is in a separate file
// import ReportModel from './Report';

export interface Project extends Document {
  name: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  tasks: mongoose.Types.ObjectId[];
  projectLeads: mongoose.Types.ObjectId[];
  reports: mongoose.Types.ObjectId[]; // Array of Report IDs
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
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  projectLeads: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Multiple project leads
  reports: [{ type: Schema.Types.ObjectId, ref: 'Report' }], // Referencing the Report model
});

const ProjectModel =
  (mongoose.models.Project as mongoose.Model<Project>) ||
  mongoose.model<Project>('Project', ProjectSchema);

export default ProjectModel;
