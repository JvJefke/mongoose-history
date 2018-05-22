const R = require("ramda");

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

	if (isFilterRequired(filter, originalValue)) {
		return R.omit(filter.path)(acc);
	}

	return item;
}, item);
