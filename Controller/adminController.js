const db = require('../Config/db'); // Adjust path as needed

// Admin Dashboard
exports.dashboard = (req, res) => {
  console.log('Rendering admin dashboard');
  res.render('dashboard');
};

// Show the create form for a specific category
exports.showCreateForm = async (req, res) => {
  const category = req.params.category;
  console.log('Showing create form for category:', category);
  try {
    res.render('create-question', { category });
  } catch (error) {
    console.error('Error loading create form:', error.message);
    req.flash('error', 'Error loading create form');
    res.redirect('/admin/dashboard');
  }
};

// Handle question creation
exports.createQuestion = async (req, res) => {
  const category = req.params.category;
  const { question, option_a, option_b, option_c, option_d, correct_answer } = req.body;
  
  console.log('=== Creating Question ===');
  console.log('Category:', category);
  console.log('Question data:', { question, option_a, option_b, option_c, option_d, correct_answer });

  try {
    // First verify the table exists
    const tableExists = await db.oneOrNone(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )
    `, [`${category}_questions`]);

    console.log('Table exists check:', tableExists);

    if (!tableExists.exists) {
      throw new Error(`Table ${category}_questions does not exist`);
    }

    // Insert the question
    const result = await db.none(
      `INSERT INTO ${category}_questions (question, option_a, option_b, option_c, option_d, correct_answer) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [question, option_a, option_b, option_c, option_d, correct_answer.toUpperCase()]
    );

    // Verify the question was inserted
    const insertedQuestion = await db.one(
      `SELECT * FROM ${category}_questions 
       WHERE question = $1 
       ORDER BY id DESC 
       LIMIT 1`,
      [question]
    );
    
    console.log('Question inserted successfully:', insertedQuestion);
    console.log('=== End Creating Question ===');

    // Show blank page with popup and redirect
    res.render('success');
  } catch (error) {
    console.error('Error adding question:', error.message);
    req.flash('error', `Failed to add question: ${error.message}`);
    res.redirect(`/admin/questions/create/${category}`);
  }
};

// List/manage all questions under a category (View)
const validCategories = ['logical', 'numerical', 'verbal']; // example categories

exports.manageQuestions = async (req, res) => {
  const category = req.params.category;
  console.log('=== Managing Questions ===');
  console.log('Category:', category);

  if (!validCategories.includes(category)) {
    console.error('Invalid category:', category);
    req.flash('error', 'Invalid question category.');
    return res.redirect('/admin/dashboard');
  }

  const searchTerm = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  try {
    console.log('Fetching questions with params:', { category, searchTerm, page, pageSize, offset });
    
    // First verify the table exists
    const tableExists = await db.oneOrNone(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )
    `, [`${category}_questions`]);

    console.log('Table exists check:', tableExists);

    if (!tableExists.exists) {
      throw new Error(`Table ${category}_questions does not exist`);
    }

    // Get total count
    const countResult = await db.one(`SELECT COUNT(*) FROM ${category}_questions`);
    console.log('Total questions in database:', countResult.count);

    // Get questions for current page
    let query = `SELECT * FROM ${category}_questions`;
    const params = [];

    if (searchTerm) {
      query += ` WHERE question ILIKE $1`;
      params.push(`%${searchTerm}%`);
    }

    query += ` ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`;
    console.log('Executing query:', query);
    console.log('With params:', params);

    const questions = await db.any(query, params);
    console.log('Questions fetched:', questions.length);
    console.log('First question:', questions[0]);
    console.log('=== End Managing Questions ===');

    const totalQuestions = parseInt(countResult.count);
    const totalPages = Math.ceil(totalQuestions / pageSize);

    res.render('manage-questions', {
      category,
      questions,
      successMessage: req.flash('success'),
      errorMessage: req.flash('error'),
      searchTerm,
      currentPage: page,
      totalPages,
      pageSize,
      totalCount: totalQuestions
    });
  } catch (err) {
    console.error('Error fetching questions:', err.message);
    req.flash('error', `Failed to load questions: ${err.message}`);
    res.redirect('/admin/dashboard');
  }
};

// Show edit form
exports.showEditForm = async (req, res) => {
  const category = req.params.category;
  const id = req.params.id;
  console.log('Showing edit form for question:', { category, id });

  try {
    const question = await db.one(`SELECT * FROM ${category}_questions WHERE id = $1`, [id]);
    console.log('Question found:', question);
    res.render('edit-question', { category, question });
  } catch (err) {
    console.error('Error fetching question:', err.message);
    req.flash('error', `Error loading question: ${err.message}`);
    res.redirect(`/admin/questions/${category}`);
  }
};

// Update question
exports.updateQuestion = async (req, res) => {
  const category = req.params.category;
  const id = req.params.id;
  const { question, option_a, option_b, option_c, option_d, correct_answer } = req.body;
  
  console.log('Updating question:', { category, id, question });

  try {
    await db.none(
      `UPDATE ${category}_questions
       SET question = $1, option_a = $2, option_b = $3, option_c = $4, option_d = $5, correct_answer = $6
       WHERE id = $7`,
      [question, option_a, option_b, option_c, option_d, correct_answer.toUpperCase(), id]
    );
    console.log('Question updated successfully');
    req.flash('success', 'Question updated successfully!');
    res.redirect(`/admin/questions/${category}`);
  } catch (err) {
    console.error('Error updating question:', err.message);
    req.flash('error', `Error updating question: ${err.message}`);
    res.redirect(`/admin/questions/${category}`);
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  const category = req.params.category;
  const id = req.params.id;
  console.log('Deleting question:', { category, id });

  try {
    await db.none(`DELETE FROM ${category}_questions WHERE id = $1`, [id]);
    console.log('Question deleted successfully');
    req.flash('success', 'Question deleted successfully!');
    res.redirect(`/admin/questions/${category}`);
  } catch (err) {
    console.error('Error deleting question:', err.message);
    req.flash('error', `Failed to delete question: ${err.message}`);
    res.redirect(`/admin/questions/${category}`);
  }
};
