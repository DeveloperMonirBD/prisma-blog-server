import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import nodemailer from 'nodemailer';
import { verificationEmail } from './email/verification';
import { prisma } from './prisma';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql'
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: 'string',
                defaultValue: 'USER',
                required: false
            },
            phone: {
                type: 'string',
                required: false
            },
            status: {
                type: 'string',
                defaultValue: 'ACTIVE',
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

            try {
                const email = verificationEmail(user.name, verificationUrl);

                await transporter.sendMail({
                    from: '"Prisma Blog" <prismablog@gmail.com>',
                    to: user.email,
                    subject: 'Verify your email - Prisma Blog',
                    text: email.text,
                    html: email.html
                });
            } catch (err) {
                console.error('Error while sending mail:', err);
            }
        }
    },
    socialProviders: {
        google: {
            prompt: 'select_account consent',
            accessType: 'offline',
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            scope: ['openid', 'email', 'profile']
        }
    }
});
