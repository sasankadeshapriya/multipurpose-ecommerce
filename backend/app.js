const express= require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

const adminRoute = require ('./routes/admin.route');
const roleRoute = require ('./routes/role.route');
const permissionRoute = require ('./routes/permission.route');
const passwordRoute = require ('./routes/password.route');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.use("/api/su/admin", adminRoute);
app.use("/api/su/role", roleRoute);
app.use("/api/su/permission", permissionRoute);
app.use("/api/password", passwordRoute);

app.get("/", (req, res) => {
  res.send("server is ready!");
});

module.exports = app;