const expect = require("chai").expect;
const sinon = require("sinon");

const Helpers = require("./_helpers");

describe("getOneHistory", () => {
	let _instance;
	let execSpy;
	let findOneSpy;

	beforeEach(() => {
		_instance = Helpers.getInstance.default();

		execSpy = sinon.spy(() => Promise.resolve({ uuid: "someUuid" }));
		findOneSpy = sinon.spy(() => ({
			lean: () => ({
				exec: execSpy,
			}),
		}));

		_instance._model = {
			findOne: findOneSpy,
		};
	});

	it("get History item by uuid", () => _instance.getOneHistory("someUuid").then((result) => {
		expect(result).to.eql({ uuid: "someUuid" });
		expect(findOneSpy.calledOnce).to.be.true;
		expect(execSpy.calledOnce).to.be.true;
		expect(findOneSpy.firstCall.args).to.eql([{ uuid: "someUuid" }]);
	}));
});
