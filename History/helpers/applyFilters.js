/**
 * Apply filters helper module
 * @module Helpers
 */

const R = require("ramda");

const isMappingRequired = (filter) => typeof filter.map === "function";

const isFilterRequired = (filter, value) => {
	switch (typeof filter.exclude) {
		case "boolean":
			return filter.exclude;
		case "string":
			return value.match(new RegExp(filter.exclude));
		case "function":
			return filter.exclude(value, filter.path);
		default:
			if (filter.exclude instanceof RegExp) {
				return value.match(filter.exclude);
			}

			return false;
	}
};

/**
 * Apply filters to object
 * @function applyFilters
 *
 * @param {Object} item Input object
 * @param {Object[]} filters Array of filter defenitions
 * @param {String[]} filters.path Path of the field to be filtered
 * @param {Boolean|String|RegExp|Function} [filters.exclude] Exclude filter. Behavior depends on dataType:
 * - Boolean|Falsy: true => exclude, falsy => include
 * - String|RegExp: Regex used to filter the value
 * - Function: Filter by specified function `(item, path) => true|false;`
 * @param {Function} [filters.map] Mapping function <br />`(item, path) => mappedObject;`
 *
 * @returns {Object} New filtered object
 */
module.exports = (item, filters) => filters.reduce((acc, filter) => {
	if (typeof filter !== "object" || !filter.path) {
		console.error("Invalid filter passed"); // eslint-disable-line no-console

		return acc;
	}

	let value = R.path(filter.path)(acc);

	// Set new value if mapping function is specified
	if (isMappingRequired(filter)) {
		value = filter.map(value, filter.path);
		acc = R.set(R.lensPath(filter.path), value)(acc);
	}

	// Filter item from the object if filtering is required
	if (isFilterRequired(filter, value)) {
		return R.dissocPath(filter.path)(acc);
	}

	return acc;
}, item);
