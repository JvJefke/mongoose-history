const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;
const uuid = require("node-uuid");

const DEFAULT_NAME = "history";
const PATCH_SCHEMA =  [{
	op: {
		type: String,
		resuired: true,
		enum: ["add", "remove", "replace", "move", "copy", "test"], // Allowed by RFC6902 standard
	},
	path: {
		type: String,
		required: true,
	},
	from: {
		type: String,
	},
	value: {
		type: Mixed,
	},
}];
const DEFAULT_SCHEMA = {
	uuid: {
		type: String,
		default: uuid,
		required: true,
		index: true,
	},
	// follows RFC6902 standard standard https://tools.ietf.org/html/rfc6902
	patches: PATCH_SCHEMA,
	reverse: PATCH_SCHEMA,
	meta: {
		type: {
			type: String,
			required: true,
		},
		created: {
			type: Date,
			required: true,
			default: Date.now,
		},
		user: {
			type: String,
		},
		data: {
			type: Mixed,
		},
	},
};

const disableMethod = (type) => (next) => next(new Error(`History cannot be ${type}!`));

module.exports = (config = {}) => {
	// Get correct mongoose instance
	const mongooseInstance = config.instance || mongoose;

	// Get existing model if available instead of creating a new one
	if (mongooseInstance.models[config.name || DEFAULT_NAME]) {
		return mongooseInstance.models[config.name || DEFAULT_NAME];
	}

	// Create the mongoose schema
	const HistorySchema = new Schema(config.schema || DEFAULT_SCHEMA, { strict: true });

	// Set the name of the collection
	HistorySchema.set("collection", config.name || DEFAULT_NAME);

	// Like blockchain, history should only be able to be added.
	// This will not be able to block everything since de mongoose middleware api is really bad :'(
	HistorySchema.pre("remove", disableMethod("removed"));
	HistorySchema.pre("update", disableMethod("updated"));
	HistorySchema.pre("findOneAndRemove", disableMethod("updated"));
	HistorySchema.pre("findOneAndUpdate", disableMethod("updated"));

	return mongooseInstance.model(config.name || DEFAULT_NAME, HistorySchema);
};
