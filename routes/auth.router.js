const expressp = require('express');
const passport = require('passport');

const AuthService = require('./../services/auth.service');
const validatorHandler = require('../middlewares/validator.handler');
const { changeAuthPassword } = require('../schemas/auth.schema');

const service = new AuthService();

const router = expressp.Router();

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const userLogin = req.user;
      res.json(service.signToken(userLogin));
    } catch (err) {
      next(err);
    }
  }
);

router.post('/recover-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    const respuesta = await service.sendRecoveryPassword(email);
    res.json(respuesta);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/change-password',
  validatorHandler(changeAuthPassword, 'body'),
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const respuesta = await service.changePassword(token, newPassword);
      res.json({ respuesta });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
