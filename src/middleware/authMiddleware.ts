import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { db } from "../db/database";


// Extend Express types
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
    }
}

/**
 * AUTHENTICATION Middleware
 * Verifies the token and adds req.user
 */
export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Get token from cookie OR header (more flexible)
        const token = req.cookies?.access_token;
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        // Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            email: string;
            role: string;
        };
        const getUserRole = async (userId: string) => {
            return await db('Users').select('role').where({ id: userId }).first();
        };

        getUserRole(decoded.id)
            .then(user => {
            if (!user) {
                res.status(401).json({ error: 'User not found' });
                return;
            }

            // Add user to the request
            req.user = { ...decoded, role: user.role };

            next();
            })
            .catch(error => {
            res.status(500).json({
                error: 'Failed to retrieve user role',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
            });

    } catch (error) {
        res.status(401).json({
            error: 'Invalid or expired token',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * AUTHORIZATION Middleware
 * Verifies that the user has the correct role
 */
export const authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        // Verify that authenticate has already been executed
        if (!req.user) {
            res.status(401).json({
                error: 'User not authenticated',
                message: 'authenticate middleware must be used before authorize'
            });
            return;
        }

        // Verify the role
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Access denied',
            });
            return;
        }

        next();
    };
};