const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');

// Landing
router.get('/', authController.getLanding);

// Signup
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

// Login
router.get('/login', authController.login);
router.post('/login', authController.postLogin);

// Logout
router.get('/logout', authController.logout);

// Email verification
router.get('/verify-email/:token', authController.verifyEmail);

// Home (protected)
router.get('/home', authController.ensureAuth, authController.getHome);

// Quiz (protected)
// This route could serve a generic quiz page
router.get('/quiz', authController.ensureAuth, authController.getQuiz);

// New: Quiz by category (protected)
router.get('/quiz/:category', authController.ensureAuth, authController.getQuestionsByCategory);

module.exports = router;
