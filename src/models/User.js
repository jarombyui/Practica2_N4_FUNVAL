import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

class User {
  static async all() {
    const [usuarios] = await pool.execute('SELECT * FROM users');
    return usuarios;
  }

  static async getById(id) {
    const [usuario] = await pool.execute('SELECT * FROM users WHERE user_id = ?', [id]);
    return usuario;
  }

  static async where(campo, valor) {
    const [usuario] = await pool.execute(`SELECT * FROM users WHERE ${campo} = ?`, [valor]);
    return usuario;
  }

  static async create({ fName, mName, lName, username, email, password }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const campos = ['f_name', 'username', 'email', 'password'];
    const values = [fName, username, email, hashedPassword];

    if (mName) {
      campos.push('m_name');
      values.push(mName);
    }

    if (lName) {
      campos.push('l_name');
      values.push(lName);
    }

    const camposString = campos.join(', ');
    const placeholders = values.map(() => '?').join(', ');

    const nuevoUsuario = await pool.execute(`INSERT INTO users(${camposString}) VALUES (${placeholders})`, values);

    return nuevoUsuario;
  }

  static async updatePassword(userId, newPassword) {
    await pool.execute('UPDATE users SET password = ? WHERE user_id = ?', [newPassword, userId]);
  }
}

export default User;

