const pool = require('../config/database');
const bcrypt = require('bcrypt');

class UserModel {
  // Create new user
  async create(userData) {
    const { name, email, password, role = 'customer' } = userData;
    
    // Hash password (10 rounds of salting)
    const password_hash = await bcrypt.hash(password, 10);
    
    try {
      const result = await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role, created_at`,
        [name, email, password_hash, role]
      );
      
      return result.rows[0];
    } catch (error) {
      // Duplicate email error
      if (error.code === '23505') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  // Find user by email
  async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND is_active = true',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Find user by ID
  async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, name, email, role, is_active, created_at, updated_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // Update user profile
  async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic UPDATE query
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'password' && key !== 'email') {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING id, name, email, role, updated_at
    `;

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(userId, newPassword) {
    const password_hash = await bcrypt.hash(newPassword, 10);
    
    try {
      await pool.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [password_hash, userId]
      );
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
}

module.exports = new UserModel();