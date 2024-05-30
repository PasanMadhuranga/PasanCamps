const express = require("express");
const router = express.Router({ mergeParams: true });
const { storeReturnTo } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");
const passport = require("passport");

router.route("/register")
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser))

// passport.authenticate('local'): This uses the passport-local strategy to authenticate the user. 
// The local strategy is typically used for username/password authentication.
// Options:
// failureFlash: true: This enables flash messages for authentication failures. 
// If the login attempt fails, a flash message with the error will be shown to the user.
// failureRedirect: '/login': This specifies that if authentication fails, the user should be redirected back to the /login page.
router.route("/login")
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);

router.get("/logout", users.logoutUser)

module.exports = router;
