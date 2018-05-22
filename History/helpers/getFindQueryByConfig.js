const getQueryByUuid = (model, config) => {
	return model.find({ $or: [{ uuid: config.startUuid }, { uuid: config.endUuid }] })
		.lean().exec()
		.then((result) => {
			const query = {
				$and: [],
			};
			const startPoint = result.find((item) => item.uuid === config.startUuid);
			const endPoint = result.find((item) => item.uuid === config.endUuid);

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


module.exports = (model, config) => {
	const useUuid = !!config.startUuid;

	if (useUuid) {
		return getQueryByUuid(model, config);
	}

	return getQueryByDate(model, config);
};
