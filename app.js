require('dotenv').config(); // load env vars ASAP

const express = require('express'); 
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const db = require('./Config/db');
const seedAdmin = require('./Utils/seedAdmin');
const initDb = require('./Utils/initDb');

// Initialize database and seed admin
async function initialize() {
  try {
    // Initialize database tables
    await initDb();
    // Seed admin user
    await seedAdmin();
    console.log('✅ Database and admin user initialized successfully');
  } catch (error) {
    console.error('❌ Error during initialization:', error.message);
  }
}

// Run initialization
initialize();

// Route imports
const authRoutes = require('./Routes/authRoutes');
const userRoutes = require('./Routes/UserRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const logicalRoutes = require('./Routes/logicalRoutes');
const verbalRoutes = require('./Routes/verbalRoutes');
const numericalRoutes = require('./Routes/numericalRoutes');

const app = express();

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views/pages'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(flash());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('success');
  res.locals.errorMessage = req.flash('error');
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('landing');
});

app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/', logicalRoutes);
app.use('/', verbalRoutes);
app.use('/', numericalRoutes);

app.post('/submit-test', (req, res) => {
  const answers = req.body;
  console.log('User submitted answers:', answers);
  res.send('Test submitted successfully!');
});

app.get('/submit-test', (req, res) => {
  res.render('submit-test');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
