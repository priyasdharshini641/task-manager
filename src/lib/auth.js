import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function signToken(userId) {
  return jwt.sign({ userId }, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}