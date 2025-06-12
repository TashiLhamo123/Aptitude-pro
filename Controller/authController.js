const bcrypt = require('bcrypt');
const db = require('../Config/db');

// Landing Page
exports.getLanding = (req, res) => {
  res.render('landing');
};

// Signup Page (GET)
exports.getSignup = (req, res) => {
  res.render('signup', { message: null });
};

// Signup Form Submission (POST)
exports.postSignup = async (req, res) => {
  console.log('Signup attempt:', req.body);
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    console.log('Missing required fields');
    return res.render('signup', { message: 'All fields are required.' });
  }

  if (password.length < 6) {
    console.log('Password too short');
    return res.render('signup', { message: 'Password must be at least 6 characters long.' });
  }

  try {
    // Check if email already exists
    const existing = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    if (existing) {
      console.log('Email already exists:', email);
      return res.render('signup', { message: 'Email already exists.' });
    }

    // Hash password and create user
    const hashed = await bcrypt.hash(password, 10);
    console.log('Creating new user:', { name, email });
    
    await db.none('INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4)', [name, email, hashed, 'user']);
    console.log('User created successfully');

    // Store success message in session and redirect to login
    req.session.successMessage = 'Signup successful! Please log in.';
    console.log('Redirecting to login page');
    return res.redirect('/login');
  } catch (err) {
    console.error('Signup error:', err);
    return res.render('signup', { 
      message: 'An error occurred during signup. Please try again.',
      name: name, // Preserve the name in case of error
      email: email // Preserve the email in case of error
    });
  }
};

// Login Page (GET)
exports.login = (req, res) => {
  const successMessage = req.session.successMessage;
  const message = req.session.errorMessage;
  // Clear the messages from session
  delete req.session.successMessage;
  delete req.session.errorMessage;
  res.render('login', { message, successMessage });
};

// Login Form Submission (POST)
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { message: 'Please enter both email and password.' });
  }

  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('login', { message: 'Invalid email or password.' });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Redirect based on role
    if (user.role && user.role.toLowerCase() === 'admin') {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/home');
    }

  } catch (err) {
    console.error('Login error:', err);
    return res.render('login', { message: 'An error occurred. Please try again later.' });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/');
  });
};

// Middleware to protect routes
exports.ensureAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

// Home Page
exports.getHome = (req, res) => {
  const testCategories = [
    { title: 'Quantitative Aptitude', image: 'quantitative.png' },
    { title: 'Logical Reasoning', image: 'logical.png' },
    { title: 'Verbal Ability', image: 'verbal.png' }
  ];

  res.render('home', {
    user: req.session.user,
    testCategories
  });
};

// Quiz Page
exports.getQuiz = (req, res) => {
  res.render('quiz', { user: req.session.user });
};

exports.getQuestionsByCategory = async (req, res) => {
  const category = req.params.category; // e.g., 'logical', 'numerical', 'verbal'

  try {
    // WARNING: Be careful with dynamic table names - make sure to sanitize or whitelist categories
    const allowedCategories = ['logical', 'numerical', 'verbal'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).send('Invalid category');
    }

    const questions = await db.any(`SELECT * FROM ${category}_questions ORDER BY id DESC`);

    res.render('quiz', {
      user: req.session.user,
      category,
      questions
    });
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).send('Error loading questions');
  }
};