import { Server } from 'http';
import app from './app';
import { prisma } from './lib/prisma';

const port = process.env.PORT;
let server: Server;

async function main() {
    try {
        await prisma.$connect();
        console.log('Connected to the database successfully.');

        server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('An error occurred during startup:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    if (server) server.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    if (server) server.close();
    process.exit(0);
});
