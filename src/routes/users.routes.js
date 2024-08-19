import { Router } from 'express';
import { Login, verificarToken } from '../controllers/user.controller.js';

const router = Router();

router.post('/login', Login); // Ruta para hacer login
router.get('/verify', verificarToken); // Ruta para verificar el token

export default router;


