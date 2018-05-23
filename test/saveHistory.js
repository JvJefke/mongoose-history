const expect = require("chai").expect;
const sinon = require("sinon");

const Helpers = require("./helpers");

describe("saveHistory", () => {
	let _instance;

	beforeEach(() => _instance = Helpers.getInstance.default());

	it("Should save a history item", () => {
		const createSpy = sinon.spy((input) => Promise.resolve(Object.assign({}, input, { uuid: "someUuid" })));

		_instance._model = {
			create: createSpy,
		};

		return _instance.saveHistory(Helpers.constants.DEFAULT_HISTORY_ITEM)
			.then((result) => {
				expect(result).to.have.property("uuid", "someUuid");
				expect(createSpy.calledOnce).to.be.true;
				expect(createSpy.firstCall.args).to.eql([Helpers.constants.DEFAULT_HISTORY_ITEM]);
			});
	});
});
