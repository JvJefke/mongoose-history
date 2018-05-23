const expect = require("chai").expect;
const Mongoose = require("mongoose").Mongoose;

const History = require("../");
const type = "Type1";

describe("constructor", () => {
	it("Should create a History instance without additional config", () => {
		const _instance = new History(type);

		expect(_instance).to.be.instanceof(History);
		expect(_instance._filters).to.eql([]);
		expect(_instance._model).to.be.an("function");
		expect(_instance._model.modelName).to.equal("history");
		expect(_instance._type).to.eql(type);
	});

	it("Should create a History instance with a custom mongoose instance", () => {
		const mongooseInstance = new Mongoose();
		const _instance = new History(type, {
			mongoose: {
				instance: mongooseInstance,
				dbName: "customHistory",
			},
		});

		expect(_instance).to.be.instanceof(History);
		expect(_instance._filters).to.eql([]);
		expect(_instance._model.base).to.equal(mongooseInstance);
		expect(_instance._model).to.be.an("function");
		expect(_instance._model.modelName).to.equal("customHistory");
		expect(_instance._type).to.eql(type);
	});

	it("Should create a History instance with filters", () => {
		const filters = [{
			path: ["some", "path"],
			exclude: true,
		}];
		const _instance = new History(type, { filters });

		expect(_instance).to.be.instanceof(History);
		expect(_instance._filters).to.eql(filters);
		expect(_instance._model).to.be.an("function");
		expect(_instance._type).to.eql(type);
	});
});
