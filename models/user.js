const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// User Blueprint
const userSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	addressLineMain: {
		type: String,
		required: true
	},
	addressLineSecondary: {
		type: String
	},
	city: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	zip: {
		type: Number,
		required: true
	},
	classYear: {
		type: Number,
		required: true
	},
	major: {
		type: String,
		required: true
	},
	occupation: {
		type: String
	},
	company: {
		type: String
	},
	password: {
		type: String,
		required: true
	},
	type: {
		type: String,
		default: "alumni",
		required: true
	},
	social: {
		facebook: {
			type: String
		},
		linkedIn: {
			type: String
		},
		twitter: {
			type: String
		},
		instagram: {
			type: String
		}
	},
	profileUrl: {
		type: String,
		default: ""
	},
	resetToken: String,
	resetTokenExpiration: Date,
	connections: {
		requests: [
			{
				requestUser: {
					type: Schema.Types.ObjectId,
					ref: "User",
					required: true
				},
				requestMessage: {
					type: String,
					required: true
				}
			}
		],
		connected: [
			{
				connectionId: {
					type: Schema.Types.ObjectId,
					ref: "User",
					required: true
				},
				requestMessage: {
					type: String,
					required: true
				}
			}
		]
	}
});

userSchema.methods.addConnectionRequest = function(connectionRequest) {
	// TODO: Check If Already Established
	const connectionPresent = this.connections.requests.some(connection => {
		return (
			connection.requestUser.toString() ===
			connectionRequest.id.toString()
		);
	});

	if (connectionPresent) {
		// send current product
		return this.save();
	}

	const connectionRequestsNew = [
		...this.connections.requests,
		{
			requestUser: mongoose.Types.ObjectId(connectionRequest.id),
			requestMessage: connectionRequest.message
		}
	];

	this.connections.requests = connectionRequestsNew;
	return this.save();
};

userSchema.methods.removeConnectionRequest = function(connectionId) {
	const connectionRemoved = this.connections.requests.filter(connection => {
		return connection.requestUser.toString() !== connectionId.toString();
	});

	this.connections.requests = connectionRemoved;
	return this.save();
};

userSchema.methods.addConnection = async function(connectionId) {
	// Connection ID = CONNECTION TO ACCEPT
	// Check If Already There
	const connectionToAddPre = this.connections.requests.filter(connection => {
		return connectionId.toString() === connection.requestUser.toString();
	});

	const connectionToAdd = connectionToAddPre.map(connection => {
		return {
			connectionId: connection.requestUser,
			requestMessage: connection.requestMessage
		};
	});

	if (connectionToAdd.length > 0) {
		// Clear Out The One Already Found Above
		const connectionRequestsFiltered = this.connections.requests.filter(
			connection => {
				return (
					connection.requestUser.toString() !==
					connectionId.toString()
				);
			}
		);

		this.connections.requests = connectionRequestsFiltered;
		this.connections.connected = [
			...this.connections.connected,
			connectionToAdd[0]
		];

		const connectionMessage = connectionToAdd[0].requestMessage;

		//! ADDING TO USER THAT REQUESTED
		await this.constructor.addConnectionToRequestor(
			connectionId,
			this._id,
			connectionMessage
		);

		return this.save();
	}
};

//! Add Connection To User That Requested
userSchema.statics.addConnectionToRequestor = async function(
	userToAddConnectionTo,
	connectionToAdd,
	requestMessage
) {
	// Check if not already connected.

	const user = await this.findById(userToAddConnectionTo);

	user.connections.connected = [
		...user.connections.connected,
		{
			connectionId: connectionToAdd,
			requestMessage: requestMessage
		}
	];

	return user.save();
};

module.exports = mongoose.model("User", userSchema);
