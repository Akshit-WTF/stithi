require("dotenv").config();
const shortid = require("shortid");
var schedule = require('node-schedule');
// const routes = fs
//   .readdirSync(__dirname + "/routes")
//   .filter((file) => file.endsWith(".js"));
require("./utils/compareVersions")();
const log = require("./handlers/logHandler");
const request = require("request");
const am = require("./routes/admin");
const is = require("./routes/issues");
const uptime = require("./models/status");
const others = require("./models/others");
const iss = require("./models/issues");
const hu = require("./models/hu");
const express = require("express");
const basicAuth = require("express-basic-auth");
const findServices = require("./utils/findServices");
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
var moment = require("moment"); // require
app.set("view engine", "ejs");
app.use(express.static("public"));

async function checkUptime() {
    const services = await findServices();
    services.forEach((service) => {
        async function check() {
            const x = await uptime.findOne({
                name: service.name
            });
            const time = new Date();
            await request.get(x.url, async function() {
                const ping = new Date() - time;
                const arr = [{
                    time: new Date(),
                    ping: ping
                }];
                x.uptime = x.uptime.concat(arr);
                x.ping = ping;
                log.stithi(
                    `Status checked for ${service.name} and recorded latency of ${ping}ms`
                );
                await x.save();
            });
        }
        if (service.status) {
            check();
        }
    });
}

setInterval(checkUptime, 30000);


schedule.scheduleJob('0 0 * * *', async () => { 
    await iss.create({
        date: new Date(new Date(new Date().toJSON().slice(0,10).replace(/-/g,'/')).getTime())
      })
 })

async function myAsyncAuthorizer(username, password, cb) {
    const user = await others.findOne({
        username: username
    });

    if (!user) {
        return cb(null, false);
    }
    if (password === user.password) return cb(null, true);
    else return cb(null, false);
}
app.locals.moment = moment;
app.get("/", async (req, res) => {
    const systems = await uptime.find({
        status: true
    }, {
        uptime: {
            $slice: -288
        }
    });
    const issues = await iss.find().sort({$natural:-1});
    const upt = await hu.find();
    res.render("index", {
        systems: systems,
        issues: issues,
        hu: upt
    });
});
app.use(
    basicAuth({
        authorizer: myAsyncAuthorizer,
        authorizeAsync: true,
        challenge: true,
    })
);
// for (const route of routes) {
//   var x = route.slice(0, -3);
//   var name = require(__dirname + "/routes/" + route);
//   log.stithi(`Loaded route ${x}`);
//   app.use("/" + x, name);
// }

// app.get("/admin", async (req, res) => {
//     res.render("dashboard", {
//         red: req,
//         services: await uptime.find(),
//         issues: await iss.find(),
//     });
// });

// app.get("/admin/newservice", async (req, res) => {
//     res.render("snew", {
//         red: req,
//     });
// });
// app.get("/admin/newissue", async (req, res) => {
//     res.render("inew", {
//         red: req,
//         services: await uptime.find(),
//     });
// });

// app.get("/admin/editissue", async (req, res) => {
//     res.render("issue", {
//         red: req,
//         issues: await iss.find(),
//     });
// });

// app.post("/service/new", async (req, res) => {
//     const another = await uptime.create({
//         url: req.body.url,
//         delay: req.body.delay,
//         name: req.body.name,
//         status: true,
//     });
//     res.json(another);
// });
// app.post("/issue/new", async (req, res) => {
//     const aaj = new Date(new Date(new Date().toJSON().slice(0,10).replace(/-/g,'/')).getTime())
//     const today = await iss.findOne({
//         date: aaj
//     });
//     const data = [{
//         url: shortid.generate(),
//         name: req.body.name,
//         service: req.body.service,
//         actions: [{
//             action: req.body.action,
//             description: req.body.description,
//             time: new Date(),
//         }, ],
//         status: req.body.issolved,
//     }, ];
//     const tbp = today.issues.concat(data);
//     today.issues = tbp;
//     const saved = await today.save();
//     res.json(saved);
// });

app.use("/admin", am)
app.use("/issues", is)
const listener = app.listen(process.env.port, () => {
    log.info(`Stithi has started on port ` + listener.address().port);
});