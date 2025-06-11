const express = require('express');
const router = express.Router();

// GET /test/logical
router.get('/test/logical', (req, res) => {
  res.render('logical');  // Because logical.ejs is directly inside views/pages/
});

// POST /test/logical
router.post('/test/logical', (req, res) => {
  const { answer } = req.body;

  req.session.answers = req.session.answers || {};
  req.session.answers.q1 = answer;

  //console.log("Answer to Q1:", answer);

  res.redirect('/test/logical2');
});

// GET /test/logical2
router.get('/test/logical2', (req, res) => {
  res.render('logical2', { answer: req.session.answers?.q1 });
}); 
// GET /test/logical2
router.get('/test/logical2', (req, res) => {
  res.render('logical2');
});

// POST /test/logical2
router.post('/test/logical2', (req, res) => {
  const { answer } = req.body;

  req.session.answers.q2 = answer;

  //console.log("Answer to Q2:", answer);

  // Redirect to results or next question
  res.redirect('/test/logicalResults');
});

// GET /test/results (final page)
router.get('/test/logicalResults', (req, res) => {
  const answers = req.session.numericalAnswers || {};
  res.render('logicalResults', { answers }); 
});


module.exports = router;
