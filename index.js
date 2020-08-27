require("dotenv").config();
const shortid = require('shortid');

const request = require("request");
const mongoose = require("mongoose");
const uptime = require("./status");
const others = require("./others");
const iss = require("./issues");
const express = require("express");
const basicAuth = require("express-basic-auth");
const app = express();

var moment = require('moment'); // require
app.set("view engine", "ejs");
app.use(express.static('public'))
mongoose.connect(process.env.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.log.bind(console, "Could not connect to the database!"));
db.once("open", async function (callback) {
  const systems = await uptime.find();
  systems.forEach(async (system) => {
    async function check() {
      const time = new Date();
      const x = await uptime.findOne({ name: system.name });
      request.get(x.url, async function () {
        const ping = new Date() - time
        const arr = [{ time: new Date(), ping: ping }];
        x.uptime = x.uptime.concat(arr);
        x.ping = ping;
        const check = await x.save();
      });
    }
    if (system.status) {
      setInterval(check, system.delay || 60000 * 5);
    }
  });
});



async function myAsyncAuthorizer(username, password, cb) {
  const user = await others.findOne({ username: username });

  if (!user) {
    return cb(null, false);
  }

  if (password === user.password) return cb(null, true);
  else return cb(null, false);
}
app.locals.moment = moment;
app.get("/", async (req, res) => {
  const systems = await uptime.find({status: true}, {uptime: {$slice: -288}});
  const issues = await iss.find();
  res.render("index", { systems: systems, issues: issues });
});
app.use(
    basicAuth({
      authorizer: myAsyncAuthorizer,
      authorizeAsync: true,
      challenge: true,
    })
  );
  var bodyParser = require("body-parser");
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

app.get('/admin', async (req, res) => {
    res.render('dashboard', {
        red: req,
        services: await uptime.find(),
        issues: await iss.find()
    })
})

app.get('/admin/newservice', async (req, res) => {
    res.render('snew', {
        red: req
    })
})
app.get('/admin/newissue', async (req, res) => {
    res.render('inew', {
        red: req,
        services: await uptime.find()
    })
})

app.get('/admin/editissue', async (req, res) => {
    res.render('issue', {
        red: req,
        issues: await iss.find()
    })
})



app.post('/service/new', async (req, res) => {
    const another = await uptime.create({
        url: req.body.url,
        delay: req.body.delay,
        name: req.body.name,
        status: true
    })
    res.json(another)
})
app.post('/issue/new', async (req, res) => {
  const aaj = new Date(1598466600000)
  const today = await iss.findOne({date: aaj})
  const data = [{
    "url": shortid.generate(),
    "name": req.body.name,
    "service": req.body.service,
    "actions": [{action: req.body.action, description: req.body.description, time: new Date()}],
    "status": req.body.issolved
}]
  const tbp = today.issues.concat(data)
  today.issues = tbp
  const saved = await today.save();
  res.json(saved)
})
const listener = app.listen(process.env.port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
