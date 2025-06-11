const db = require('../Config/db');

// Get all questions
async function getAllQuestions() {
  return db.any('SELECT * FROM questions ORDER BY id');
}

// Get a single question by ID
async function getQuestionById(id) {
  return db.oneOrNone('SELECT * FROM questions WHERE id = $1', [id]);
}

// Create a new question
async function createQuestion(question, optionA, optionB, optionC, optionD, correctOption) {
  return db.one(
    `INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_option)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [question, optionA, optionB, optionC, optionD, correctOption]
  );
}

// Update a question
async function updateQuestion(id, question, optionA, optionB, optionC, optionD, correctOption) {
  return db.oneOrNone(
    `UPDATE questions
     SET question = $1, option_a = $2, option_b = $3, option_c = $4, option_d = $5, correct_option = $6
     WHERE id = $7
     RETURNING *`,
    [question, optionA, optionB, optionC, optionD, correctOption, id]
  );
}

// Delete a question
async function deleteQuestion(id) {
  return db.result('DELETE FROM questions WHERE id = $1', [id], r => r.rowCount);
}

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
