const expect = require("chai").expect;
const Mongoose = require("mongoose").Mongoose;

const Helpers = require("./helpers");

describe("createHistory", () => {
	let _instance;

	beforeEach(() => _instance = Helpers.getInstance.default());

	it("Should create a history Object", () => {
		const historyObject = _instance.createHistory(
			Helpers.constants.DEFAULT_PREV_ITEM,
			Helpers.constants.DEFAULT_NEXT_ITEM,
			"someRef",
			"someUser",
			{ data: "someData" }
		);

		console.log(historyObject.patches);

		expect(historyObject).to.be.an("object");

		expect(historyObject.meta).to.have.property("type", "someType");
		expect(historyObject.meta).to.have.property("ref", "someRef");
		expect(historyObject.meta).to.have.property("user", "someUser");
		expect(historyObject.meta).to.have.deep.property("data", { data: "someData" });

		expect(historyObject.patches).to.have.lengthOf(5);
		expect(historyObject.patches).to.deep.include({ op: "add", path: "/fields/added", value: "added" });
		expect(historyObject.patches).to.deep.include({ op: "add", path: "/data", value: { added: "addedObject" } });
		expect(historyObject.patches).to.deep.include({ op: "remove", path: "/fields/deleted" });
		expect(historyObject.patches).to.deep.include({ op: "replace", path: "/fields/modified", value: "modifiedAfter" });
		expect(historyObject.patches).to.deep.include({ op: "replace", path: "/meta/updated", value: Helpers.constants.DEFAULT_NEXT_ITEM.meta.updated });

		expect(historyObject.reverse).to.have.lengthOf(5);
		expect(historyObject.reverse).to.deep.include({ op: "remove", path: "/fields/added" });
		expect(historyObject.reverse).to.deep.include({ op: "remove", path: "/data" });
		expect(historyObject.reverse).to.deep.include({ op: "add", path: "/fields/deleted", value: "toBeDeleted" });
		expect(historyObject.reverse).to.deep.include({ op: "replace", path: "/fields/modified", value: "modifiedBefore" });
		expect(historyObject.reverse).to.deep.include({ op: "replace", path: "/meta/updated", value: Helpers.constants.DEFAULT_PREV_ITEM.meta.updated });
	});
});
