const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
	messages: [
		{
			message: String,
			meta: [
				{
					user: {
						type: Schema.Types.ObjectId,
						ref: User
					},
					delivered: Boolean,
					read: Boolean
				}
			]
		}
	],
	is_group_message: {
		type: Boolean,
		default: false
	},
	participants: [
		{
			user: {
				type: Schema.Types.ObjectId,
				delivered: Boolean,
				read: Boolean,
				last_seen: Date
			}
		}
	]
});

module.exports = mongoose.model("Chat", chatSchema);
