const express = require("express");
const shortid = require("shortid");
const uptime = require("../models/status");
const others = require("../models/others");
const iss = require("../models/issues")
var router = express.Router();

router.get("/", async (req, res) => {
  res.render("dashboard", {
    red: req,
    services: await uptime.find(),
    issues: await iss.find(),
  });
});
router.get("/service/new", async (req, res) => {
  res.render("snew", {
    red: req,
});
});
router.get("/issues/new", async (req, res) => {
  res.render("inew", {
    red: req,
    services: await uptime.find(),
});
});
router.get("/issues/:issue", async (req, res) => {
  const issues = await iss.find();
  issues.forEach(issue => {
    issue.issues.forEach(i => {
      if (i.url === req.params.issue) {
        return res.render("issue", {
          red: req,
          issue: i
        });
      } else {
        return res.sendStatus(404)
      }
    })
  })
});
router.get("/services/:service", async (req, res) => {
  res.render("service", {
    red: req,
    service: await uptime.findOne({name: req.params.service})
  });
});

router.get("/user/new", async (req, res) => {
  res.render("newuser", {
    red: req
  });
});

router.get("/user/change%20password", async (req, res) => {
  res.render("changepassword", {
    red: req
  });
});

router.post("/issues/new", async (req, res) => {
  const aaj = new Date(new Date(new Date().toJSON().slice(0,10).replace(/-/g,'/')).getTime())
  const today = await iss.findOne({
      date: aaj
  });
  const data = [{
      url: shortid.generate(),
      name: req.body.name,
      service: req.body.service,
      actions: [{
          action: req.body.action,
          description: req.body.description,
          time: new Date(),
      }, ],
      status: req.body.issolved,
  }, ];
  const tbp = today.issues.concat(data);
  today.issues = tbp;
  const saved = await today.save();
  res.json(saved);
});
router.post("/user/change%20password", async (req, res) => {
  const um = await others.findOne({username: req.auth.user})
  um.password = req.body.password
  const sv = await um.save()
  res.json(sv)
});

router.post("/service/new", async (req, res) => {
  const another = await uptime.create({
    url: req.body.url,
    delay: req.body.delay,
    name: req.body.name,
    status: true,
});
res.json(another);
});

router.post("/user/new", async (req, res) => {
  const um = await others.create({
    username: req.body.username,
    password: req.body.password
  })
  res.json(um)
});

router.get("/", async (req, res) => {
  res.render("dashboard", {
    red: req,
    services: await uptime.find(),
    issues: await iss.find(),
  });
});
module.exports = router;
