const express = require('express');
const router = express.Router();
const adminController = require('../Controller/adminController');
const db = require('../Config/db');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).send("Access denied.");
};

// Test database connection
router.get('/test-db', async (req, res) => {
  try {
    const result = await db.one('SELECT NOW()');
    res.json({ 
      status: 'success', 
      message: 'Database connection successful',
      timestamp: result.now
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Admin dashboard
router.get('/dashboard', isAdmin, adminController.dashboard);

// Create question
router.get('/questions/create/:category', isAdmin, adminController.showCreateForm);
router.post('/questions/create/:category', isAdmin, adminController.createQuestion); // ❗ We'll fix redirect here

// View questions (list page)
router.get('/questions/:category', isAdmin, adminController.manageQuestions);

// Edit question
router.get('/questions/edit/:category/:id', isAdmin, adminController.showEditForm);
router.post('/questions/edit/:category/:id', isAdmin, adminController.updateQuestion);

// Delete question
router.post('/questions/delete/:category/:id', isAdmin, adminController.deleteQuestion);

module.exports = router;
