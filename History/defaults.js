const Schema = require("mongoose").Schema;
const Mixed = Schema.Types.Mixed;
const uuid = require("node-uuid");

module.exports.DEFAULT_NAME = "history";
const PATCH_SCHEMA = module.exports.PATCH_SCHEMA =  [{
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

module.exports.DEFAULT_SCHEMA = {
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
		ref: {
			type: String,
		},
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

