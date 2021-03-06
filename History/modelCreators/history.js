const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const defaults = require("../defaults");

const disableMethod = (type) => (next) => next(new Error(`History cannot be ${type}!`));

module.exports = (config = {}) => {
	// Get correct mongoose instance
	const mongooseInstance = config.instance || mongoose;

	// Get existing model if available instead of creating a new one
	if (mongooseInstance.models[config.dbName || defaults.DEFAULT_NAME]) {
		return mongooseInstance.models[config.dbName || defaults.DEFAULT_NAME];
	}

	// Create the mongoose schema
	const HistorySchema = new Schema(config.schema || defaults.DEFAULT_SCHEMA, { strict: true });

	// Set the name of the collection
	HistorySchema.set("collection", config.dbName || defaults.DEFAULT_NAME);

	// Like blockchain, history should only be able to be added.
	// This will not be able to block everything since de mongoose middleware api is really bad :'(
	HistorySchema.pre("remove", disableMethod("removed"));
	HistorySchema.pre("update", disableMethod("updated"));
	HistorySchema.pre("findOneAndRemove", disableMethod("updated"));
	HistorySchema.pre("findOneAndUpdate", disableMethod("updated"));

	return mongooseInstance.model(config.dbName || defaults.DEFAULT_NAME, HistorySchema);
};
