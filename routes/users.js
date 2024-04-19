const express = require("express");
const router = express.Router({ mergeParams: true });
const { storeReturnTo } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");
const passport = require("passport");

router.route("/register")
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser))

router.route("/login")
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);

router.get("/logout", users.logoutUser)

module.exports = router;
