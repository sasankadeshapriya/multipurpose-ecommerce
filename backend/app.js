const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth.middleware");
const session = require("express-session");
const passport = require("passport");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", // React app origin
    credentials: true, // Allow cookies to be sent
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: parseInt(process.env.COOKIE_EXPIRE, 10),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
require("./utils/passport-setup");

//Import Routes
const adminRoute = require("./routes/admin.route");
const roleRoute = require("./routes/role.route");
const permissionRoute = require("./routes/permission.route");
const passwordRoute = require("./routes/password.route");
const userRoute = require("./routes/user.route");
const productRoute = require ('./routes/product.route');

//Routes List
app.use("/api/su/admin", adminRoute);
app.use("/api/su/role", roleRoute);
app.use("/api/su/permission", permissionRoute);
app.use("/api/password", passwordRoute);
app.use("/api/user", userRoute);
app.use("/api/product", auth(), productRoute);

app.get("/unauthorized", (req, res) => {
  res
    .status(401)
    .send(
      "Unauthorized: No email associated with the Facebook account. Registration cannot proceed."
    );
});

app.get("/", (req, res) => {
  res.send("server is ready!");
});

module.exports = app;
