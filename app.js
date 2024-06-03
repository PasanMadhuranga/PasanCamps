// loads environment variables from a .env file only if the application is not running in a production environment.
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");

// helmet is a collection of 14 smaller middleware functions that set HTTP headers to secure the application.
const helmet = require("helmet");

// ejs-mate is a package for Express.js that extends the EJS (Embedded JavaScript) templating engine. 
const ejsMate = require("ejs-mate");

// Allows to create custom error objects that include a message and a status code. 
const ExpressError = require("./utils/ExpressError");

// Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. 
// It provides a straightforward, schema-based solution to model your application data. 
const mongoose = require("mongoose");

// method-override is a middleware for Express.js that allows you to use HTTP verbs such as PUT or DELETE 
// in places where the client doesn't support it.
const methodOverride = require("method-override");

// express-session is a middleware for Express.js that allows you to store session data on the server. 
// It adds a session object to the request object in your application.
// By default, express-session uses cookies to store a session identifier on the client-side. 
// The actual session data is stored on the server-side, and the session identifier in the cookie is used to retrieve this data.
const session = require("express-session");

// The connect-flash middleware is used in Express.js applications to manage flash messages. Flash messages are temporary messages used to convey information to the user, such as notifications, warnings, success messages, or errors. 
// These messages are stored in the session and are designed to be displayed to the user only once, typically after a redirect.
const flash = require("connect-flash");

// Passport is an authentication middleware for Node.js that provides a set of plugins to handle authentication in your application.
const passport = require("passport");  

// express-mongo-sanitize is a middleware for Express.js that sanitizes user input to prevent NoSQL injection attacks.
const mongoSanitize = require("express-mongo-sanitize");

// passport-local is a strategy for Passport.js that authenticates users using a username and password. 
// It is called "local" because it uses the local database for authentication.
const LocalStrategy = require("passport-local");

// The User model is a Mongoose model that represents a user in the application.
const User = require("./models/user");

// Require the routes
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const { name } = require("ejs");

// mongoose.connect: This method is used to establish a connection to the MongoDB database.
// Connection String: "mongodb://127.0.0.1:27017/pasan-camps"
  // mongodb://: The protocol used to connect to MongoDB.
  // 127.0.0.1: The IP address of the MongoDB server. 127.0.0.1 refers to localhost, meaning the database server is running on the same machine as the application.
  // 27017: The default port number on which MongoDB listens for connections.
  // pasan-camps: The name of the database you want to connect to. If the database does not exist, MongoDB will create it for you when you insert the first document.
mongoose
  .connect("mongodb://127.0.0.1:27017/pasan-camps")
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!");
    console.log(err);
  });

// serves static assets from the public directory.
app.use(express.static(path.join(__dirname, "public")));

// Configures EJS Mate as the template engine.
// A template engine is a tool used to generate HTML output by combining static templates with dynamic data. 
app.engine("ejs", ejsMate);

// Sets the directory for view templates.
app.set("views", path.join(__dirname, "views"));

// Uses EJS as the default template engine.
app.set("view engine", "ejs");

// The express.urlencoded middleware parses the URL-encoded data and makes it available on req.body.
// If you have a form with fields name and age, after parsing, you can access these values as req.body.name and req.body.age.
app.use(express.urlencoded({ extended: true }));

// allows the use of HTTP methods like PUT and DELETE in forms.
app.use(methodOverride("_method"));

// set the mongoSanitize middleware to sanitize user input to prevent NoSQL injection attacks.
app.use(mongoSanitize());

// The helmet middleware is used to set various HTTP headers to secure the application.
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com",
  "https://api.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://kit.fontawesome.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
  "https://conoret.com",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com",
  "https://stackpath.bootstrapcdn.com",
  "https://api.mapbox.com",
  "https://api.tiles.mapbox.com",
  "https://fonts.googleapis.com",
  "https://use.fontawesome.com",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com",
  "https://*.tiles.mapbox.com",
  "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          childSrc: ["blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dujhq8egd/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com",
              "https://cdn.dribbble.com",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

// Sets up and configures the session middleware with security settings and expiration details.
const sessionConfig = {
  // The name of the session ID cookie. This is the name that will be used to store the session ID in the browser. 
  // we change this to prevent attackers from identifying the application.
  name: "session",
  // A string used to sign the session ID cookie. It should be a complex, random string to enhance security.
  secret: "thisshouldbeabettersecret",
  // When set to false, it prevents the session from being saved back to the session store if it wasn't modified during the request.
  resave: false,
  // This setting will save new, unmodified sessions to the session store. As soon as a user visits your site and a session is created, it will be stored.
  saveUninitialized: true,
  cookie: {
    // The cookie is not accessible via client-side JavaScript, enhancing security.
    httpOnly: true,
    // The cookie will only be sent over HTTPS connections, providing additional security.
    // secure: true,
    // Sets a specific expiration date and time for the cookie, providing absolute control over its lifetime.
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    // Defines the maximum age for the cookie in milliseconds, offering a relative expiration time from the moment it is set.
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// This line uses the session middleware with the configuration defined above. 
// It initializes session handling for the application, allowing you to store and manage session data.
app.use(session(sessionConfig));

// This line uses the flash middleware. It initializes flash messages for the application, allowing you to display temporary messages to the user.
app.use(flash());

// Initializes Passport, which is used for authentication.
app.use(passport.initialize());

// Integrates Passport with the Express session. This allows Passport to serialize and deserialize user information and manage persistent login sessions.
app.use(passport.session());

// Configures Passport to use the local strategy for authentication. 
// User.authenticate() is a method provided by Passport-Local Mongoose to handle the authentication process.
passport.use(new LocalStrategy(User.authenticate()));

// Defines how user information is stored in the session. 
// User.serializeUser() is a method provided by Passport-Local Mongoose to serialize user instances to the session.
passport.serializeUser(User.serializeUser());

// Defines how user information is retrieved from the session. 
// User.deserializeUser() is a method provided by Passport-Local Mongoose to deserialize user instances from the session.
passport.deserializeUser(User.deserializeUser());

// This middleware runs on every request and sets local variables that will be available in all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Mounts the user routes on the root path.
app.use("/", userRoutes);

// Mounts the campground routes on /campgrounds.
app.use("/campgrounds", campgroundRoutes);

// Mounts the review routes on /campgrounds/:id/reviews.
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

// This line defines a catch-all route handler for all HTTP methods (app.all) and any paths (*).
// If no other route matches the request, this handler creates a new ExpressError with the message "Page Not Found" and a status code of 404, 
// then passes it to the next middleware using next.
app.all("*", (req, res, next) => {
  res.status(404).render("page404")
});

// This middleware Provides a centralized place to handle all errors that occur in the application.
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  //   res.status(statusCode): Sets the HTTP status code of the response to the statusCode determined earlier.
  // .render("error", { err }): Renders error.ejs and passes the err
  res.status(statusCode).render("error", { err });
});

// Starts the Express server on port 3000.
app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
