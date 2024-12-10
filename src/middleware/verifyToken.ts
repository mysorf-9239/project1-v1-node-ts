import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        res.status(403).send("A token is required for authentication");
        return;
    } else {
        try {
            req.body.verify = jwt.verify(token, JWT_SECRET_KEY) as { id: string; name: string, email: string };

            return next();
        } catch (err) {
            res.status(401).send("Invalid Token");
            return;
        }
    }
};

export default verifyToken;
