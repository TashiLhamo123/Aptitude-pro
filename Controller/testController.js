// Dummy questions – replace with DB data later
const logicalQuestions = [
  { question: "What comes next: 2, 4, 8, 16, ?", answer: "32" },
  { question: "All squares are rectangles. Are all rectangles squares?", answer: "No" }
];

const numericalQuestions = [
  { question: "5 + 7 = ?", answer: "12" },
  { question: "10 * 2 = ?", answer: "20" }
];

exports.getLogicalQuestions = (req, res) => {
  res.render('logical', { questions: logicalQuestions });
};

exports.submitLogicalAnswers = (req, res) => {
  const userAnswers = req.body.answers;
  let score = 0;

  logicalQuestions.forEach((q, i) => {
    if (userAnswers[i] && userAnswers[i].toLowerCase() === q.answer.toLowerCase()) {
      score++;
    }
  });

  res.send(`You scored ${score} out of ${logicalQuestions.length}`);
};

exports.getNumericalQuestions = (req, res) => {
  res.render('numerical', { questions: numericalQuestions });
};

exports.submitNumericalAnswers = (req, res) => {
  const userAnswers = req.body.answers;
  let score = 0;

  numericalQuestions.forEach((q, i) => {
    if (userAnswers[i] && userAnswers[i] === q.answer) {
      score++;
    }
  });

  res.send(`You scored ${score} out of ${numericalQuestions.length}`);
};
