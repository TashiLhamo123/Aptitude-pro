const express = require('express');
const router = express.Router();
const db = require('../Config/db');

// Middleware to check if user is logged in and role is 'user'
const isUser = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'user') {
    next();
  } else {
    res.redirect('/login');
  }
};

// Home page - protected
router.get('/home', isUser, (req, res) => {
  res.render('home', { user: req.session.user });
});

// Quiz page - fetch all questions (optional, or remove if not used)
router.get('/quiz', isUser, async (req, res) => {
  try {
    const questions = await db.any('SELECT * FROM questions');
    res.render('quiz', { user: req.session.user, questions });
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).send('Failed to load questions');
  }
});

// Dynamic route: quiz by category (e.g., logical, numerical, verbal)
router.get('/quiz/:category', isUser, async (req, res) => {
  const category = req.params.category.toLowerCase();

  // Validate category to prevent SQL injection risk
  const allowedCategories = ['logical', 'numerical', 'verbal'];
  if (!allowedCategories.includes(category)) {
    return res.status(400).send('Invalid quiz category');
  }

  try {
    const tableName = `${category}_questions`; // e.g., logical_questions
    const questions = await db.any(`SELECT * FROM ${tableName} ORDER BY RANDOM() LIMIT 10`);
    res.render('quiz', {
      user: req.session.user,
      category: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize
      questions
    });
  } catch (err) {
    console.error('Error fetching category questions:', err);
    res.status(500).send('Unable to load questions');
  }
});

// Handle test submission
router.post('/submit-test', isUser, async (req, res) => {
  const { category } = req.body;
  const answers = {};
  let score = 0;
  let totalQuestions = 0;

  // Extract answers from request body
  Object.keys(req.body).forEach(key => {
    if (key.startsWith('q')) {
      const questionId = key.substring(1);
      answers[questionId] = req.body[key];
    }
  });

  try {
    // Get correct answers from database
    const tableName = `${category}_questions`;
    const questions = await db.any(`SELECT id, correct_answer FROM ${tableName} WHERE id IN ($1:list)`, 
      [Object.keys(answers)]);

    // Calculate score
    questions.forEach(q => {
      totalQuestions++;
      if (answers[q.id] === q.correct_answer) {
        score++;
      }
    });

    // Save test result to database
    await db.none(
      `INSERT INTO test_results (user_id, category, score, total_questions, answers)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.session.user.id, category, score, totalQuestions, JSON.stringify(answers)]
    );

    // Render results page
    res.render('test-results', {
      user: req.session.user,
      category: category.charAt(0).toUpperCase() + category.slice(1),
      score,
      totalQuestions,
      percentage: (score / totalQuestions * 100).toFixed(2)
    });

  } catch (err) {
    console.error('Error processing test submission:', err);
    res.status(500).send('Error processing your test submission');
  }
});

module.exports = router;
