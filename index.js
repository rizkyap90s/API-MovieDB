require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
}); // Config environment
const express = require("express"); // Import express
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const app = express(); // Make express app

// CORS
app.use(cors());

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attact
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 mins
  max: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Use helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  app.use(morgan("dev"));
} else {
  // create a write stream (in append mode)
  let accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    {
      flags: "a",
    }
  );

  // setup the logger
  app.use(morgan("combined", { stream: accessLogStream }));
}

/* Import routes */
const auth = require("./routes/authRoute");
const reviews = require("./routes/reviewRoutes");
const category = require("./routes/categoryRoutes");
const genre = require("./routes/genreRoute");
const movie = require("./routes/moviesRoutes");
const actor = require("./routes/actorRoutes");

/* Import errorHandler */
const errorHandler = require("./middlewares/errorHandler/errorHandler");

/* Enable req.body */
app.use(express.json()); // Enable req.body JSON
// Enable url-encoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

/* Enable req.body and req.files (form-data) */
app.use(fileUpload());

/* Make public folder as static */
app.use(express.static("public"));

//check and create public dir
const publicPath = "./public";
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath);
  fs.mkdirSync(publicPath + "/images");
  fs.mkdirSync(publicPath + "/images/actors");
  fs.mkdirSync(publicPath + "/images/users");
  fs.mkdirSync(publicPath + "/images/poster");
  fs.mkdirSync(publicPath + "/images/thumbnail");
}

/* Use routes */
app.get("/", async (req, res, next) => {
  try {
    res.redirect("https://documenter.getpostman.com/view/16564652/TzsfnkdT");
  } catch (error) {
    next(error);
  }
});

// /* The routes */
app.use("/api/v1/actor", actor);
app.use("/api/v1/movie", movie);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/category", category);
app.use("/api/v1/genre", genre);
app.use("/auth", auth);

/* If routes not found */
app.all("*", (req, res, next) => {
  try {
    next({ message: "Endpoint not Found", statusCode: 404 });
  } catch (error) {
    next(error);
  }
});

/* User errorHandler */
app.use(errorHandler);

/* Running server */

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
