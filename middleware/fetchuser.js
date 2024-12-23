import jwt from 'jsonwebtoken'; // ES module import
import dotenv from 'dotenv';   // ES module import
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
  // Get user from token in header and add it to request object
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ error: 'Enter valid token' });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Enter valid token' });
  }
};

export default fetchuser; // ES module export
