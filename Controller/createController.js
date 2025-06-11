const db = require('../Config/db'); // adjust path to your db connection

exports.createQuestion = async (req, res) => {
  const { question, option_a, option_b, option_c, option_d, correct_answer } = req.body;

  try {
    await db.none(
      'INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer) VALUES ($1, $2, $3, $4, $5, $6)',
      [question, option_a, option_b, option_c, option_d, correct_answer.toUpperCase()]
    );
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error saving question:', err);
    console.error(err);
    res.status(500).send('Failed to save question.');
  }
};
