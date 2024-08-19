import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';


const _dirname = dirname(fileURLToPath(import.meta.url));
const usersFilePath = join(_dirname, '../data/users.json');

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // aqui se traen los datos del doc json con el modulo 'fs'
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    const usuario = usersData.find(user => user.username === username);

    if (!usuario) {
      return res.status(404).json({ message: 'El usuario no existe' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario.id, username: usuario.username },
      'qweasd123', // Llave secreta
      { expiresIn: '1m' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verificarToken = async (req, res) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(403).json({ message: 'Token no proporcionado' });
    }

    const token = authorization.split(' ')[1];

    // Verificar el token
    jwt.verify(token, 'qweasd123', (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'El token ha expirado' });
        } else {
          return res.status(401).json({ message: 'Token inválido' });
        }
      }

      // Si el token es válido
      res.json({ message: 'Token válido', decoded });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
