const pool = require('../Config/db');

async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function isAdmin(userId) {
  const result = await pool.query('SELECT is_admin FROM users WHERE id = $1', [userId]);
  return result.rows[0]?.is_admin;
}

module.exports = {
  findUserByEmail,
  isAdmin
};
