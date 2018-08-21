/**
 * Apply filters helper module
 * @module Helpers
 */

const getQueryByUuid = (model, config) => {
	return model.find({ $or: [{ uuid: config.startUuid }, { uuid: config.endUuid }] })
		.lean().exec()
		.then((result) => {
			const query = {
				$and: [],
			};
			const startPoint = result.find((item) => item.uuid === config.startUuid);
			const endPoint = result.find((item) => item.uuid === config.endUuid);

			if (!startPoint && !endPoint) {
				return {};
			}

			if (startPoint) {
				query.$and.push({
					"meta.created": { $gte: new Date(startPoint.meta.created) },
				});
			}

			if (endPoint) {
				query.$and.push({
					"meta.created": { $lte: new Date(endPoint.meta.created) },
				});
			}

			return query;
		});
};

const getQueryByDate = (model, config) => {
	const query = {
		$and: [],
	};

	if (!config.startDate && !config.endDate) {
		return Promise.resolve({});
	}

	if (config.startDate) {
		query.$and.push({
			"meta.created": { $gte: new Date(config.startDate) },
		});
	}

	if (config.endDate) {
		query.$and.push({
			"meta.created": { $lte: new Date(config.endDate) },
		});
	}

	return Promise.resolve(query);
};

/**
 * Get find query by config
 * @function getFindQueryByConfig
 *
 * @param {Class} model
 * @param {Object} [config={}]
 */
module.exports = (model, config = {}) => {
	const useUuid = !!config.startUuid;
	const hasRef = !!config.ref;
	const q = {};

	if (hasRef) {
		q["meta.ref"] = config.ref;
	}

	if (useUuid) {
		return getQueryByUuid(model, config).then((result) => Object.assign(q, result));
	}

	return getQueryByDate(model, config).then((result) => Object.assign(q, result));
};
