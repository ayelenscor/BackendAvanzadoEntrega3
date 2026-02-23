import { Router } from 'express';
import passport from '../utils/passportUtil.js';

const router = Router();

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
  res.json({
    status: 'success',
    user: req.user
  });
});

export default router;
