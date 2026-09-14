import { auth } from '../lib/auth';
import { prisma } from '../lib/prisma';

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@example.com';

        const existingAdmin = await prisma.user.findUnique({
            where: {
                email: adminEmail
            }
        });

        if (existingAdmin) {
            console.log('Admin already exists');
            return;
        }

        const response = await auth.api.signUpEmail({
            body: {
                name: 'Admin',
                email: adminEmail,
                password: 'AdminPassword123!'
            }
        });

        console.log('Admin created:', response.user.email);

        await prisma.user.update({
            where: {
                id: response.user.id
            },
            data: {
                role: 'ADMIN',
                emailVerified: true
            }
        });

        console.log('Admin role assigned successfully');
    } catch (err) {
        console.error('Admin seeding failed:', err);
    }
};
