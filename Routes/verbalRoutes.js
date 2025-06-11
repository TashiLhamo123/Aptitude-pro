const express = require('express');
const router = express.Router();

// GET Question 1
router.get('/test/verbal', (req, res) => {
  res.render('verbal');
});

// POST Question 1
router.post('/test/verbal', (req, res) => {
  const { answer } = req.body;
  req.session.verbalAnswers = { q1: answer };
  res.redirect('/test/verbal2');
});

// GET Question 2
router.get('/test/verbal2', (req, res) => {
  res.render('verbal2');
});

// POST Question 2
router.post('/test/verbal2', (req, res) => {
  const { answer } = req.body;
  req.session.verbalAnswers.q2 = answer;
  res.redirect('/test/verbalResults');
});

// GET Results
router.get('/test/verbalResults', (req, res) => {
  const answers = req.session.verbalAnswers || {};
  res.render('verbalResults', { answers });
});

module.exports = router;
