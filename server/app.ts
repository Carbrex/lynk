import "express-async-errors";
import express, { Express } from "express";
import morgan from "morgan";
// extra security
// const helmet = require('helmet');
// const cors = require('cors');
// const xss = require('xss-clean');
// const rateLimiter = require('express-rate-limit');

import dotenv from "dotenv";
dotenv.config();

const app: Express = express();

app.use(morgan("dev"));

// connectDB
import connectDB from "./db/connect";
// const connectDB = require("./db/connect");
// const authenticateUser = require("./middleware/authentication");

// // routers
// const authRouter = require("./routes/auth");
// const jobsRouter = require("./routes/jobs");

// // error handler
// const notFoundMiddleware = require("./middleware/not-found");
// const errorHandlerMiddleware = require("./middleware/error-handler");

// app.set("trust proxy", 1);
// // app.use(rateLimiter({
// //   windowMs: 15*60*1000,//15 minutes
// //   max: 100
// // }));
// app.use(express.json());
// extra packages
// app.use(helmet());
// app.use(cors());
// app.use(xss());

app.get("/", (req, res) => {
  res.send("jobs api");
});
// routes
// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// app.use(notFoundMiddleware);
// app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (typeof mongoUri === "undefined") {
      console.log("MONGO_URI not provided");
      console.log("exiting");
      return;
    }
    await connectDB(mongoUri);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();