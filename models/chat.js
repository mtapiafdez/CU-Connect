const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Chat Blueprint
const chatroomSchema = new Schema({
	messages: [
		{
			message: String,
			meta: {
				user: {
					type: Schema.Types.ObjectId,
					ref: "User"
				}
			}
		}
	],
	participants: [
		{
			user: {
				type: Schema.Types.ObjectId
			}
		}
	]

	// roomId: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	default: mongoose.Types.ObjectId,
	// 	index: { unique: true }
	// }
});

chatroomSchema.methods.addNewMessage = function(message, messageUser) {
	const messageObj = {
		_id: mongoose.Types.ObjectId(),
		message: message,
		meta: {
			_id: mongoose.Types.ObjectId(),
			user: mongoose.Types.ObjectId(messageUser)
		}
	};

	const newMessages = [...this.messages, messageObj];

	this.messages = newMessages;

	return this.save();
};

module.exports = mongoose.model("Chatroom", chatroomSchema);
