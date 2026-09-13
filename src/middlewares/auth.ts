import { Request, Response, NextFunction } from 'express';
import { auth as betterAuth } from '../lib/auth';

export const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get current session
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            });

            // Check authentication
            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: 'You are not authenticated'
                });
            }

            // Check email verification
            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: 'Email verification required. Please verify your email'
                });
            }

            // Check role
            if (roles.length > 0 && !roles.includes(session.user.role as string)) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not authorized'
                });
            }

            // Attach authenticated user
            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role as string,
                emailVerified: session.user.emailVerified
            };

            next();
        } catch (error) {
            console.error('Auth middleware error:', error);

            return res.status(500).json({
                success: false,
                message: 'Authentication failed'
            });
        }
    };
};
