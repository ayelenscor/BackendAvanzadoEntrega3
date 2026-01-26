import { Router } from 'express';
import passport from '../utils/passportUtil.js';
import jwt from 'jsonwebtoken';
import User from '../dao/models/userModel.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    const user = new User({ first_name, last_name, email, age, password, role });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el registro', error: err.message });
  }
});

// Login de usuario
router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || 'Login fallido' });
    // Generar JWT
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login exitoso', token });
  })(req, res, next);
});

// Ruta protegida de ejemplo
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user });
});

export default router;
