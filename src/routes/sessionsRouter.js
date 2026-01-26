import { Router } from 'express';
import passport from '../utils/passportUtil.js';

const router = Router();

// Estrategia "current": simplemente usa JWT y retorna el usuario autenticado
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Retorna los datos del usuario autenticado extraídos del JWT
  res.json({
    status: 'success',
    user: req.user
  });
});

export default router;
