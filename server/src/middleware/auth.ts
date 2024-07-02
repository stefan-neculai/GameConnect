import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = 'your_jwt_secret'; // Use the same secret used for signing the JWT

interface AuthenticatedRequest extends Request {
  user?: any; // You can type this more strictly if needed
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token; // Correctly split the header to extract the token
    //console.log(token)
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
