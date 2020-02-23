import express from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  INVALID_USERNAME,
  INVALID_EMAIL,
  INVALID_PASSWORD,
  INVALID_EMAIL_OR_PASSWORD,
  USER_ALREADY_EXISTS,
  ERROR_SAVING_USER,
  SERVER_ERROR,
  ERROR_RETRIEVING_USER,
} from '../constants/messages';
import { timeToDie } from '../constants/tokenExpiration';
import routes from '../constants/routes';
import User from '../models/User';
import auth from '../middlewares/auth';

const router = express.Router();

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
  routes.register,
  [
    check('username', INVALID_USERNAME)
      .not()
      .isEmpty()
      .not()
      .isEmail(),
    check('email', INVALID_EMAIL).isEmail(),
    check('password', INVALID_PASSWORD).isLength({ min: 6 }),
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: USER_ALREADY_EXISTS });
      }
      user = new User({
        username,
        password,
        email,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.SECRET,
        {
          expiresIn: timeToDie,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send(ERROR_SAVING_USER);
    }
  },
);

router.post(
  routes.login,
  [
    check('email', INVALID_EMAIL).isEmail(),
    check('password', INVALID_PASSWORD).isLength({ min: 6 }),
  ],
  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(400).json({ message: INVALID_EMAIL_OR_PASSWORD });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: INVALID_EMAIL_OR_PASSWORD });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.SECRET,
        {
          expiresIn: timeToDie,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        },
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: SERVER_ERROR });
    }
  },
);

/**
 * @method - GET
 * @description - Get logged in user
 * @param - /user/me
 */

router.get(routes.me, auth, async(req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-_id')
      .select('-__v');
    res.json(user);
  } catch (e) {
    res.send({ message: ERROR_RETRIEVING_USER });
  }
});

export default router;
