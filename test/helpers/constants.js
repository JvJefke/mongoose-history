const baseDate = new Date();

module.exports = {
	BASE_DATE: baseDate,
	DEFAULT_PREV_ITEM: {
		meta: {
			created: baseDate.toISOString(),
			updated: new Date(baseDate.getTime() + 10000).toISOString(),
		},
		fields: {
			fixed: "fixed",
			modified: "modifiedBefore",
			deleted: "toBeDeleted",
		},
	},
	DEFAULT_NEXT_ITEM: {
		fields: {
			fixed: "fixed",
			modified: "modifiedAfter",
			added: "added",
		},
		data: {
			added: "addedObject",
		},
		meta: {
			created: baseDate.toISOString(),
			updated: new Date(baseDate.getTime() + 30000).toISOString(),
		},
	},
	DEFAULT_HISTORY_ITEM: {
		patches: [
			{ op: "remove", path: "/fields/deleted" },
			{ op: "replace", path: "/fields/modified", value: "modifiedAfter" },
			{ op: "add", path: "/fields/added", value: "added" },
			{ op: "replace", path: "/meta/updated", value: new Date(baseDate.getTime() + 30000).toISOString() },
			{ op: "add", path: "/data", value: { added: "addedObject" } },
		],
		reverse: [
			{ op: "replace", path: "/meta/updated", value: new Date(baseDate.getTime() + 10000).toISOString() },
			{ op: "remove", path: "/data" },
			{ op: "remove", path: "/fields/added" },
			{ op: "replace", path: "/fields/modified", value: "modifiedBefore" },
			{ op: "add", path: "/fields/deleted", value: "toBeDeleted" },
		],
		meta: {
			type: "someType",
			ref: "someRef",
			user: "someUser",
			data: { data: "someData" },
		},
	},
	HISTORY_ITEMS_CHAIN_RESULT: {
		fields: {
			fixed: "fixed",
			modified: "modifiedAfterAfter",
			added: "added",
			addedSecond: "addedSecond",
		},
		meta: {
			created: baseDate.toISOString(),
			updated: new Date(baseDate.getTime() + 30000).toISOString(),
		},
	},
	HISTORY_ITEMS_CHAIN: [{
		patches: [
			{ op: "remove", path: "/fields/deleted" },
			{ op: "replace", path: "/fields/modified", value: "modifiedAfter" },
			{ op: "add", path: "/fields/added", value: "added" },
			{ op: "replace", path: "/meta/updated", value: new Date(baseDate.getTime() + 30000).toISOString() },
			{ op: "add", path: "/data", value: { added: "addedObject" } },
		],
		reverse: [
			{ op: "replace", path: "/meta/updated", value: new Date(baseDate.getTime() + 10000).toISOString() },
			{ op: "remove", path: "/data" },
			{ op: "remove", path: "/fields/added" },
			{ op: "replace", path: "/fields/modified", value: "modifiedBefore" },
			{ op: "add", path: "/fields/deleted", value: "toBeDeleted" },
		],
		meta: {
			type: "someType",
			ref: "someRef",
			user: "someUser",
			data: { data: "someData" },
		},
	}, {
		patches: [
			{ op: "replace", path: "/fields/modified", value: "modifiedAfterAfter" },
			{ op: "add", path: "/fields/addedSecond", value: "addedSecond" },
			{ op: "remove", path: "/data" },
		],
		reverse: [
			{ op: "replace", path: "/fields/modified", value: "modifiedAfter" },
			{ op: "remove", path: "/fields/addedSecond" },
			{ op: "add", path: "/data", value: { added: "addedObject" } },
		],
		meta: {
			type: "someType",
			ref: "someRef",
			user: "someUser",
			data: { data: "someData" },
		},
	}],
};
