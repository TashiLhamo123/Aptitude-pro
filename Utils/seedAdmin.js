const db = require('../Config/db'); // your pg-promise db instance
const bcrypt = require('bcrypt');

async function seedAdmin() {
  try {
    // Create users table if it doesn't exist
    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const email = 'admin@aptitudepro.com';
    const password = 'admin123';
    const name = 'Super Admin';
    const role = 'admin';

    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.none(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        [name, email, hashedPassword, role]
      );
      // console.log('✅ Default admin created');
      console.log('ℹ️ Admin already exists');
    } else {
      console.log('ℹ️ Admin already exists');
    }
  } catch (err) {
    console.error('❌ Error in seedAdmin:', err.message);
  }
}

module.exports = seedAdmin;

  
