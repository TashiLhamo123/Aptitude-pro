const db = require('../Config/db');

const allowedCategories = ['logical', 'numerical', 'verbal'];

exports.getQuestionsByCategory = async (req, res) => {
  const category = req.params.category;

  if (!allowedCategories.includes(category)) {
    return res.status(400).send("Invalid category");
  }
  
  try {
    const questions = await db.any(`SELECT * FROM ${category}_questions ORDER BY id LIMIT 10`);
    
    res.render('quiz', {
      user: req.session.user,
      category,
      questions
    });
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).send("Error loading questions");
  }
};

