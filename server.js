const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConniction = require("./config/database");
const levelRoute = require("./routes/levelRoute");

// Connect to DB
dbConniction();

// Express app
const app = express();

// Middlewares
app.use(express.json());

// eslint-disable-next-line eqeqeq
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/levels", levelRoute);

// Handle all other requests with 404 error
app.all("*", (req, res, next) => {
  // Create  error and send it to error handleing middelware
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling meddleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down... `);
    process.exit(1);
  });
});
