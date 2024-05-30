const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
  const { email, username, password } = req.body.user;
  const user = new User({ email, username });
  let registeredUser;
  try {
    // User.register(user, password): Registers the user with the specified password. 
    // This method is provided by Passport.js, which integrates with Mongoose to hash the password and store it securely.
    registeredUser = await User.register(user, password);
  } catch (e) {
    // If an error occurs during registration, the catch block catches the error.
    // req.flash("error", e.message): Sets a flash message with the error message to inform the user about what went wrong.
    // return res.redirect("/register"): Redirects the user back to the registration form to try again.
    req.flash("error", e.message);
    return res.redirect("/register");
  }

  // req.login method logs in the user. It is provided by Passport.js and adds the user information to the session.
  req.login(registeredUser, (err) => {
    // This is a Callback Function
    // If an error occurs during login, return next(err) is called to pass the error to the next middleware or error handler.
    // If login is successful, req.flash("success", "Welcome to Pasan Camps!") sets a success flash message.
    // res.redirect("/campgrounds"): Redirects the user to the campgrounds page.
    // Since catchAsync wraps the entire registerUser function, any error passed to next will be caught by catchAsync.
    if (err) return next(err);
    req.flash("success", "Welcome to Pasan Camps!");
    res.redirect("/campgrounds");
  });
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  // delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  // req.logout(function (err) { ... }): Logs out the user. This is provided by Passport.js.
  // Error Handling: If there is an error during logout, it passes the error to the next middleware.
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Good Bye!");
    res.redirect("/campgrounds");
  });
};