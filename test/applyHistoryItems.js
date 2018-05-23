const expect = require("chai").expect;

const Helpers = require("./_helpers");

describe("applyHistoryItems", () => {
	let _instance;

	beforeEach(() => _instance = Helpers.getInstance.default());

	it("Should apply history items to an object", () => {
		const result = _instance.applyHistoryItems(
			Helpers.constants.DEFAULT_PREV_ITEM,
			Helpers.constants.HISTORY_ITEMS_CHAIN
		);

		expect(result).to.eql(Helpers.constants.HISTORY_ITEMS_CHAIN_RESULT);
	});

	it("Should reverse apply history items to an object", () => {
		const result = _instance.applyHistoryItems(
			Helpers.constants.HISTORY_ITEMS_CHAIN_RESULT,
			Helpers.constants.HISTORY_ITEMS_CHAIN,
			true
		);

		expect(result).to.eql(Helpers.constants.DEFAULT_PREV_ITEM);
	});
});
