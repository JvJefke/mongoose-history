const expect = require("chai").expect;
const sinon = require("sinon");

const TestHelpers = require("../_helpers");
const Helpers = require("../../History/helpers");

const DATA = {
	data: {
		field1: "field1",
		excluded: "excluded",
	},
	meta: {
		created: new Date(),
		ref: {
			_id: "something",
		},
	},
};

describe("helpers/applyFilters", () => {
	it("Should exclude a property based on a boolean", () => {
		const result = Helpers.applyFilters(DATA, [{
			path: ["data", "excluded"],
			exclude: true,
		}]);

		expect(result).to.be.an("object");
		expect(result.data).to.be.an("object");
		expect(result.data.excluded).to.be.undefined;
	});

	it("Should not exclude a property based on a boolean", () => {
		const result = Helpers.applyFilters(DATA, [{
			path: ["data", "excluded"],
			exclude: false,
		}]);

		expect(result).to.be.an("object");
		expect(result.data).to.be.an("object");
		expect(result.data.excluded).to.be.equal("excluded");
	});

	it("Should exclude a property based on a function", () => {
		const result = Helpers.applyFilters(DATA, [{
			path: ["data", "excluded"],
			exclude: () => true,
		}]);

		expect(result).to.be.an("object");
		expect(result.data).to.be.an("object");
		expect(result.data.excluded).to.be.undefined;
	});

	it("Should exclude a property based on a function", () => {
		const result = Helpers.applyFilters(DATA, [{
			path: ["data", "excluded"],
			exclude: () => false,
		}]);

		expect(result).to.be.an("object");
		expect(result.data).to.be.an("object");
		expect(result.data.excluded).to.be.equal("excluded");
	});

	it("Should exclude a property based on a regex", () => {
		const result = Helpers.applyFilters(DATA, [{
			path: ["data", "excluded"],
			exclude: /exclu.*/,
		}]);

		expect(result).to.be.an("object");
		expect(result.data).to.be.an("object");
		expect(result.data.excluded).to.be.undefined;
	});

	it("Should exclude a property based on a regex", () => {
		const result = Helpers.applyFilters(DATA, [{
			path: ["data", "excluded"],
			exclude: /nonExclu/,
		}]);

		expect(result).to.be.an("object");
		expect(result.data).to.be.an("object");
		expect(result.data.excluded).to.be.equal("excluded");
	});

	it("Should exclude a property based on a string regex", () => {
		const result = Helpers.applyFilters(DATA, [{
			path: ["data", "excluded"],
			exclude: "exclu.*",
		}]);

		expect(result).to.be.an("object");
		expect(result.data).to.be.an("object");
		expect(result.data.excluded).to.be.undefined;
	});

	it("Should exclude a property based on a string regex", () => {
		const result = Helpers.applyFilters(DATA, [{
			path: ["data", "excluded"],
			exclude: "nonExclu",
		}]);

		expect(result).to.be.an("object");
		expect(result.data).to.be.an("object");
		expect(result.data.excluded).to.be.equal("excluded");
	});

	it("Should map a property", () => {
		const result = Helpers.applyFilters(DATA, [{
			path: ["meta", "ref"],
			map: (item) => item._id,
		}]);

		expect(result).to.be.an("object");
		expect(result.meta).to.be.an("object");
		expect(result.meta.ref).to.be.equal("something");
	});
});
