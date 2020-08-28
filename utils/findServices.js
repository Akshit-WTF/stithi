require("dotenv").config();
const log = require("../handlers/logHandler");
const mongoose = require("mongoose");
const request = require("request");
const uptime = require("../models/status");
mongoose.connect(process.env.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.log.bind(console, "Could not connect to the database!"));
db.once("open", async function (callback) {
  log.info('Connected to the MongoDB server.')
});

module.exports = async () => {
     return await uptime.find()
}