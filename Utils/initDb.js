const db = require('../Config/db');

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');

    // Create logical questions table
    console.log('Creating logical_questions table...');
    await db.none(`
      CREATE TABLE IF NOT EXISTS logical_questions (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer CHAR(1) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ logical_questions table created/verified');

    // Create numerical questions table
    console.log('Creating numerical_questions table...');
    await db.none(`
      CREATE TABLE IF NOT EXISTS numerical_questions (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer CHAR(1) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ numerical_questions table created/verified');

    // Create verbal questions table
    console.log('Creating verbal_questions table...');
    await db.none(`
      CREATE TABLE IF NOT EXISTS verbal_questions (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer CHAR(1) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ verbal_questions table created/verified');

    // Verify tables exist
    const tables = await db.any(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Existing tables:', tables.map(t => t.table_name));

    console.log('✅ Database initialization completed successfully');
  } catch (error) {
    console.error('❌ Error creating database tables:', error.message);
    throw error;
  }
}

module.exports = initializeDatabase; 