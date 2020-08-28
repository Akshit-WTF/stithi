const express = require("express");
const iss = require("../models/issues")
var router = express.Router();

router.get("/:issue", async (req, res) => {
  const issues = await iss.find();
  issues.forEach(issue => {
    issue.issues.forEach(i => {
      if (req.params.issue === i.url) {
        return res.render("issueclient", {
          red: req,
          issue: i,
          aa: issue
        });
      }
    })
  })
});

module.exports = router;
