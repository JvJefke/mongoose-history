const R = require("ramda");

const isMappingRequired = (filter) => typeof filter.map === "function";

const isFilterRequired = (filter, value) => {
	switch (typeof filter.exclude) {
		case "boolean":
			return filter.exclude;
		case "string":
			return new RegExp(filter.exclude).match(value);
		case "function":
			return filter.exclude(value, filter.path);
		default:
			if (filter.exclude instanceof RegExp) {
				return filter.exclude.match(value);
			}

			return false;
	}
};

module.exports = (item, filters) => filters.reduce((acc, filter) => {
	if (typeof filter !== "object") {
		console.error("Invalid filter passed"); // eslint-disable-line no-console

		return acc;
	}

	const originalValue = R.path(filter.path)(acc);

	// Set new value if mapping function is specified
	if (isMappingRequired(filter)) {
		R.set(R.lensPath(filter.path), filter.map(originalValue, filter.path));
	}

	// Filter item from the object if filtering is required
	if (isFilterRequired(filter, originalValue)) {
		return R.omit(filter.path)(acc);
	}

	return item;
}, item);
