import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const databaseUrl = `${process.env.DATABASE_URL}`;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing in environment variables');
}

export default defineConfig({
    schema: 'prisma/schema',
    migrations: {
        path: 'prisma/migrations'
    },
    datasource: {
        url: databaseUrl
    }
});
