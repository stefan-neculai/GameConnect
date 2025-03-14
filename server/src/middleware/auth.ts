import { configDotenv } from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

configDotenv();
const jwtSecret = process.env.JWT_SECRET ?? 'jwtsecret'; // Use a more secure secret in production

interface AuthenticatedRequest extends Request {
  user?: any; // You can type this more strictly if needed
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token; // Correctly split the header to extract the token
    console.log(req.cookies);
    if (!token) {
      return res.status(401).send('Access Denied: No token provided');
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded; // Add decoded user to request object
      next(); // Continue to the next middleware or route handler
    } catch (err) {
      res.status(401).send('Invalid Token');
    }
};

export default authenticateToken;
