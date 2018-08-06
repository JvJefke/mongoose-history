const History = require("../../");

const TYPE = "someType";

module.exports.class = History;
module.exports.default = () => new History(TYPE);
