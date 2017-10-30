import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

const WordSchema = new Schema({
	headWord: {
		type: String,
	},
	partOfSpeech: {
		type: String,
	},
	lemma: {
		type: String,
	},
	definition: {
		type: String,
	},
});

WordSchema.plugin(timestamp);

const Word = mongoose.model('word', WordSchema);

export default Word;
