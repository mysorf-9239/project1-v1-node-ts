import {NextFunction, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

// 1. Lấy tất cả user
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();

        res.status(200).json(users);
    } catch (error: any) {

        res.status(500).json({error: error.message});
    }
};

// 2. Signup
export const createUser = async (req: Request, res: Response) => {
    try {
        const {name, email, password, role} = req.body;

        const isExists = await User.findOne({where: {email}});
        if (isExists) {
            res.status(400).json({error: 'Email is already in use'});
            return;
        }

        const newUser = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            role: role || 'user',
        });

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        });
    } catch (error: any) {
        console.error("Error creating user:", error.message);
        res.status(500).json({error: error.message});
    }
};

// 3. Login
export const checkUser = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            res.status(400).json({error: "Email and password are required"});
            return;
        }

        const user = await User.findOne({where: {email}});

        if (!user) {
            res.status(401).json({error: "Invalid email or password"});
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({error: "Invalid email or password"});
            return;
        }

        const now = Math.floor(Date.now() / 1000);
        const exp = now + 12 * 60 * 60;
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                iat: now,
                exp: exp,
            },
            JWT_SECRET_KEY
        );


        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error: any) {
        console.error("Error during login:", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

// Util
export const verifyEmail = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({error: "Authorization token missing"});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as jwt.JwtPayload;

        if (decoded.email !== req.body.email) {
            return res.status(403).json({error: "Forbidden: Email mismatch"});
        }

        next();
    } catch (error) {
        res.status(401).json({error: "Invalid or expired token"});
    }
};

// 4. Change pass
export const updatePassword = async (req: Request, res: Response) => {
    try {
        const {old_password, new_password} = req.body;

        if (!old_password || !new_password || new_password.length < 6) {
            res.status(400).json({error: "Password is required and must be at least 6 characters long"});
            return;
        }

        const user = await User.findOne({where: {email: req.user?.email}});

        if (!user) {
            res.status(404).json({error: "User not found"});
            return;
        }

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            res.status(401).json({error: "Password is incorrect"});
            return;
        }

        user.password = await bcrypt.hash(new_password, 10);
        await user.save();

        res.json({message: "Password updated successfully"});
    } catch (error: any) {
        console.error("Error in updatePassword:", error.message);
        res.status(500).json({error: error.message});
    }
};

// 5. Change name
export const updateName = async (req: Request, res: Response) => {
    try {
        const {new_name} = req.body;

        if (!new_name || typeof new_name !== "string" || new_name.trim() === "") {
            res.status(400).json({error: "New name is required and must be a valid string."});
            return;
        }

        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        const user = await User.findByPk(userId);

        if (!user) {
            res.status(404).json({error: "User not found"});
            return;
        }

        user.name = new_name.trim();
        await user.save();

        res.status(200).json({message: "Name updated successfully", name: user.name});
    } catch (error: any) {
        console.error("Error in changeName:", error.message);
        res.status(500).json({error: error.message});
    }
};

// 6. Check device_id
export const checkDeviceId = async (req: Request, res: Response) => {
    try {
        const {device_id} = req.body;

        if (!device_id) {
            res.status(400).json({error: "Device ID is required"});
            return;
        }

        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        const existingDevice = await User.findOne({where: {device_id}});

        if (existingDevice) {
            res.status(200).json({success: false, message: "Device ID already exists"});
            return;
        }

        const user = await User.findByPk(userId);

        if (!user) {
            res.status(404).json({error: "User not found"});
            return;
        }

        user.device_id = device_id;
        await user.save();

        res.status(200).json({success: true, message: "Device ID saved successfully"});
    } catch (error: any) {
        console.error("Error in checkDeviceId:", error.message);
        res.status(500).json({error: error.message});
    }
};