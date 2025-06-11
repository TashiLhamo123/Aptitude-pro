const express = require('express');
const router = express.Router();

// GET Numerical Q1
router.get('/test/numerical', (req, res) => {
  res.render('numerical'); // renders numerical.ejs
});

// POST Numerical Q1
router.post('/test/numerical', (req, res) => {
  const { answer } = req.body;
  req.session.numericalAnswers = req.session.numericalAnswers || {};
  req.session.numericalAnswers.q1 = answer;

  // Redirect to question 2 page
  res.redirect('/test/numerical2');
});

// GET Numerical Q2
router.get('/test/numerical2', (req, res) => {
  res.render('numerical2'); // Create this EJS view for question 2
});

// POST Numerical Q2
router.post('/test/numerical2', (req, res) => {
  const { answer } = req.body;
  req.session.numericalAnswers.q2 = answer;

  // Redirect to results page or next steps
  res.redirect('/test/numericalResults');
});

// GET Numerical Results
router.get('/test/numericalResults', (req, res) => {
  const answers = req.session.numericalAnswers || {};
  res.render('numericalResults', { answers }); 
});

module.exports = router;
