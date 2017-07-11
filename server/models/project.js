import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
	title: {
		type: String,
		default: '',
		trim: true
	},
	testField: {
		type: String,
	}
});

ProjectSchema.plugin(timestamp);

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
