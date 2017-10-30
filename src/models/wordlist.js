import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

const WordlistSchema = new Schema({
	Wordlist: {
		type: String,
	},
	words: {
		type: [String],
	},
});

WordlistSchema.plugin(timestamp);

const Wordlist = mongoose.model('wordlist', WordlistSchema);

export default Wordlist;
