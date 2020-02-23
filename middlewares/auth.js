import jwt from 'jsonwebtoken';

import { AUTHENTICATION_ERROR, TOKEN_ERROR } from '../constants/messages';

export default function(req, res, next) {
  const token = req.header('token');
  if(!token) {
    return res.status(401).json({ message: AUTHENTICATION_ERROR });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    req.status(500).send({ message: TOKEN_ERROR });
  }
}