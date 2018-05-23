const expect = require("chai").expect;
const sinon = require("sinon");

const Helpers = require("./helpers");

describe("saveHistory", () => {
	let _instance;
	let execSpy;
	let findSpy;
	let countSpy;

	beforeEach(() => {
		_instance = Helpers.getInstance.default();

		execSpy = sinon.spy(() => Promise.resolve([1, 2, 3]));
		findSpy = sinon.spy(() => ({
			lean: () => ({
				exec: execSpy,
			}),
		}));
		countSpy = sinon.spy(() => Promise.resolve(3));

		_instance._model = {
			find: findSpy,
			count: countSpy,
		};
	});

	it("get History without config", () => _instance.getHistory().then((result) => {
		expect(result).to.eql({ items: [1, 2, 3], count: 3 });
		expect(findSpy.calledOnce).to.be.true;
		expect(execSpy.calledOnce).to.be.true;
		expect(countSpy.calledOnce).to.be.true;
		expect(findSpy.firstCall.args[0]).to.eql(countSpy.firstCall.args[0]);
		expect(findSpy.firstCall.args).to.eql([
			{ $and: [] },
			null,
			{ skip: undefined, limit: undefined },
		]);
	}));

	it("get History with date parameters", () => _instance.getHistory({
		startDate: Helpers.constants.BASE_DATE.toISOString(),
		endDate: new Date(Helpers.constants.BASE_DATE.getTime() + 30000).toISOString(),
		skip: 20,
		limit: 10,
	}).then((result) => {
		expect(result).to.eql({ items: [1, 2, 3], count: 3 });
		expect(findSpy.calledOnce).to.be.true;
		expect(execSpy.calledOnce).to.be.true;
		expect(countSpy.calledOnce).to.be.true;
		expect(findSpy.firstCall.args[0]).to.eql(countSpy.firstCall.args[0]);
		expect(findSpy.firstCall.args[0].$and)
			.to.be.an("array")
			.and.to.have.lengthOf(2);
		expect(findSpy.firstCall.args[1]).to.equal(null);
		expect(findSpy.firstCall.args[2]).to.eql({ skip: 20, limit: 10 });
	}));

	it("get History width uuid parameters", () => {
		const customExecStub = sinon.stub();
		const customFindSpy = sinon.spy(() => ({
			lean: () => ({
				exec: customExecStub,
			}),
		}));

		customExecStub.onFirstCall().returns(Promise.resolve([
			{ uuid: "endUuid", meta: { created: new Date(Helpers.constants.BASE_DATE.getTime() + 30000).toISOString() } },
			{ uuid: "startUuid", meta: { created: Helpers.constants.BASE_DATE.toISOString() } },
		]));
		customExecStub.onSecondCall().returns(Promise.resolve([1, 2, 3]));

		_instance._model.find = customFindSpy;

		return _instance.getHistory({
			startUuid: "startUuid",
			endUuid: "endUuid",
			skip: 0,
			limit: 5,
		}).then((result) => {
			expect(result).to.eql({ items: [1, 2, 3], count: 3 });
			expect(customFindSpy.calledTwice).to.be.true;
			expect(customExecStub.calledTwice).to.be.true;
			expect(countSpy.calledOnce).to.be.true;
			expect(customFindSpy.secondCall.args[0]).to.eql(countSpy.firstCall.args[0]);
			expect(customFindSpy.secondCall.args[0].$and)
				.to.be.an("array")
				.and.to.have.lengthOf(2);
			expect(customFindSpy.secondCall.args[1]).to.equal(null);
			expect(customFindSpy.secondCall.args[2]).to.eql({ skip: 0, limit: 5 });
		});
	});
});
