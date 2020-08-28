const express = require("express");
var router = express.Router()

router.get("/",
async (req, res) => {
  if (!req.body.uid) {res.status(400).send({"message": "Bad Request"}); return;}
  const rus = await reqs.findOne({ uid: req.body.uid })
  if (!await reqs.findOne({ uid: req.body.uid })) {res.sendStatus(204); return;}
      res.status(200).send(rus);
    });
module.exports = router;