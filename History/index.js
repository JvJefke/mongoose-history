const R = require("ramda");
const historyModelCreator = require("./modelCreators/history");
const fastJSONPatch = require("fast-json-patch");
const defaults = require("./defaults");

const Helpers = require("./helpers");

/**
 * History helper class
 * @constructor
 */
class History {
	static getDefaults() {
		return R.clone(defaults);
	}

	/**
	 * Create a History object
	 * @param {String} type String identifier for type of history
	 * @param {Object} config Config object
	 * @param {Object} [config.mongoose] mongoose config
	 * @param {Object} [config.mongoose.instance] Your mongoose instance
	 * @param {String} [config.mongoose.dbName] name of the db
	 * @param {Object} [config.mongoose.schema] custom Schema
	 * @param {Object[]} [config.filters] Field filter function run in order as provided
	 * @param {String[]} [config.filters.path] path of the field to be filtered
	 * @param {Boolean|String|RegExp|Function} [config.filters.exclude] Exclude filter. Behavior depends on dataType:
	 * - Boolean|Falsy: true => exclude, falsy => include
	 * - String|RegExp: Regex used to filter the value
	 * - Function: Filter by specified function `(item, path) => true|false;`
	 * @param {Function} [config.filters.map] Mapping function <br />`(item, path) => mappedObject;`
	 *
	 * @returns {History} History instance
	 */
	constructor(type, config = {}) {
		// Set type on class instance
		this._type = type;
		// Create mongoose model within the class instance
		this._model = historyModelCreator(config.mongoose);
		// Set field filters within the class instance
		this._filters = config.filters || [];
	}

	/**
	 * Create a history item based on an old an new object
	 * @param {Object} prev Old object to compare
	 * @param {Object} next New object to compare
	 * @param {String} ref Reference to the original item
	 * @param {String} [user] Id of the user that comitted the changes
	 * @param {String} [data] Extra data to be saved in the history item
	 * @param {Date} [created] overwrite created time
	 *
	 * @returns {Object} History item
	 */
	createHistory(prev, next, ref, user, data, created = new Date()) {
		if (!prev || !next) {
			throw Error("No old or new item passed!");
		}

		const prevExcluded = Helpers.applyFilters(prev, this._filters);
		const nextExcluded = Helpers.applyFilters(next, this._filters);

		return {
			patches: fastJSONPatch.compare(
				prevExcluded,
				nextExcluded
			),
			reverse: fastJSONPatch.compare(
				nextExcluded,
				prevExcluded
			),
			meta: {
				type: this._type,
				ref,
				user,
				data,
				created,
			},
		};
	}

	/**
	 * Save history object in mongoDB
	 * @param {Object} historyItem History item created by `createHistory()` function
	 *
	 * @returns {Object} Saved history item
	 */
	saveHistory(historyItem) {
		return this._model.create(historyItem);
	}

	/**
	 * Get history from start uuid to end uuid otpionally paginated
	 * @param {Object} [config] Config object
	 * @param {String} [config.ref] reference to the source item
	 * @param {String} [config.startUuid] History item (by uuid) to start from
	 * @param {Strig} [config.endUuid] History item (by uuid) to end with
	 * @param {Date} [config.startDate] History item (by uuid) to start from
	 * @param {Date} [config.endDate] History item (by uuid) to end with
	 * @param {Number} [config.skip] Skip
	 * @param {Number} [config.limit] Limit
	 * @param {number} [config.order] Order parameter (1, -1)
	 * @param {Any} [config.population] Define object population if needed
	 *
	 * @returns {Promise<Object[]>} List of history items
	 */
	getHistory(config = {}) {
		return Helpers.getFindQueryByConfig(this._model, config)
			.then((query) => this._model.count(query).then((count) => ({ query, count })))
			.then((result) => this._model.find(result.query, null, { skip: config.skip, limit: config.limit })
				.sort({ "meta.created": config.order || 1 })
				.populate(config.population || "")
				.lean().exec()
				.then((items) => ({ items, count: result.count }))
			);
	}

	/**
	 * Get a history item by uuid
	 * @param {String} uuid Uuid of the History item
	 *
	 * @returns {Promise<Object>} History item
	 */
	getOneHistory(uuid) {
		return this._model.findOne({ uuid }).lean().exec();
	}

	/**
	 * Aplly patches to a start object based on a list of historyItems
	 * @param {Object} startObject Start object that the patches should be applied to.
	 * @param {Object[]} historyItems List of history objects used to apply patches on the start object.
	 * @param {Boolean} [reverse] Specify if the patches should be reverse applied. The last history item will be used first if this is set to true. It will also use the reverse patches of the history object when set to true.
	 *
	 * @returns {Object} Returns the updated object
	 */
	applyHistoryItems(startObject, historyItems, reverse = false) {
		if (!Array.isArray(historyItems) || !historyItems.length) {
			return startObject;
		}

		return R.compose(
			// Get the `newDocument` of the result
			R.prop("newDocument"),
			// Aplly the patches
			R.curryN(2, fastJSONPatch.applyPatch)(R.clone(startObject)),
			// Get all patches in the correct order
			R.reduce(
				(acc, item) => reverse ? item.reverse.concat(acc) : acc.concat(item.patches),
				[]
			)
		)(historyItems);
	}
}

module.exports = History;
