import {Request, Response} from 'express';
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
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                role: role || 'user'
            });

            res.status(201).json({id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role});
        }
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
};

// 3. Login
export const checkUser = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});

        if (!user) {
            res.status(404).json({error: 'User not found'});
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({error: 'Invalid credentials'});
            } else {
                const token = jwt.sign({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }, JWT_SECRET_KEY, {
                    expiresIn: '12h'
                });

                res.status(200).json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token
                });
            }
        }
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
};

// 4. Change pass
export const updatePassword = async (req: Request, res: Response) => {
    try {
        const {email: verify_email} = req.body.verify;
        const {email, old_password, new_password} = req.body;

        if (email !== verify_email) {
            res.status(403).json({error: 'Forbident'});
        } else {
            const user = await User.findOne({where: {email}});

            if (!user) {
                res.status(404).json({error: 'User not found'});
            } else {
                const isMatch = await bcrypt.compare(old_password, user.password);
                if (!isMatch) {
                    res.status(401).json({error: 'Old password is incorrect'});
                } else {
                    const hashedPassword = await bcrypt.hash(new_password, 10);

                    user.password = hashedPassword;
                    await user.save();

                    res.json({message: 'Password updated successfully'});
                }
            }
        }
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
};

// 5. Change name
export const updateName = async (req: Request, res: Response) => {
    try {
        const {email: verify_email} = req.body.verify;
        const {email, old_name, new_name} = req.body;

        if (email !== verify_email) {
            res.status(403).json({error: 'Forbident'});
        } else {
            const user = await User.findOne({where: {email}});

            if (!user) {
                res.status(404).json({error: 'User not found'});
            } else {
                if (old_name === user.name) {
                    user.name = new_name;
                    await user.save();

                    res.json({message: 'Name updated successfully', name: user.name});
                } else {
                    res.status(404).json({message: 'User not correct'});
                }
            }
        }
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
};