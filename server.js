require("dotenv").config();
require("rootpath")();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const baseResponse = require("lib/base-response");
const morgan = require("morgan");

const app = express();
const config = require("config");

// settings
app.use(morgan("dev"));

app.use("/static", express.static(path.join(__dirname, "/static")));

app.use(baseResponse());

app.use(helmet());

app.use(cookieParser());

const limiter = rateLimit({
  windowMs: config.rateLimit.requests,
  max: config.rateLimit.duration,
});
app.use(limiter);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const healthCheckFn = (req, res) => {
  let result = {
    app: config.app.name,
    description: config.app.description,
    version: config.app.version,
    health: "OK",
    environment: app.get("env"),
    documentationLink: req.protocol + "://" + req.get("host") + "/api-docs",
  };

  res.json(result);
};
//paths
app.get("/", healthCheckFn);
app.get("/health", (req, res) => res.send("OK!"));

// documentation
require("config/swagger")(app);

app.use("/api", require("features"));

app.use(function (req, res) {
  res.notFound("Not Found");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.serverInternalError(err.message);
});

app.listen(config.app.port, function () {
  console.log(`Server started at port ${config.app.port}`);
});

/**
 * @swagger
 * /health:
 *  get:
 *      tags:
 *          - health
 *      summary: Check server's condition
 *      responses:
 *          200:
 *              description: Return "OK!" if server is in good condition
 */
