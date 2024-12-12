import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: string;
            };
        }
    }
}

interface JwtPayload {
    id: string;
    name: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Authorization token missing or invalid" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
            res.status(401).json({ message: "Token has expired" });
            return;
        }

        if (decoded.iat > currentTime) {
            res.status(401).json({ message: "Invalid token issuance time" });
            return;
        }

        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (err) {
        console.error("JWT Error:", err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};